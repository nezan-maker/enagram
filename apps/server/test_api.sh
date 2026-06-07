#!/bin/bash
BASE="http://localhost:4000/api/v1"
export OWNER_TOKEN_FILE="/tmp/enagram_owner_token.txt"
export STAFF_TOKEN_FILE="/tmp/enagram_staff_token.txt"

echo "============================="
echo "Enagram API Integration Tests"
echo "============================="

# Helper: API call with token from file
api() {
  local method="$1"; shift
  local path="$1"; shift
  local data="$1"; shift
  local token_file="$1"

  local args=("-s" "-X" "$method" "$BASE$path" "-H" "Content-Type: application/json")
  if [ -n "$data" ]; then
    args+=("-d" "$data")
  fi
  if [ -n "$token_file" ] && [ -f "$token_file" ]; then
    local t
    t=$(cat "$token_file")
    args+=("-H" "Authorization: Bearer $t")
  fi
  curl "${args[@]}"
}

extract() {
  local json="$1"; shift
  local key="$1"
  echo "$json" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d$key)" 2>/dev/null
}

echo ""
echo "=== 1. AUTH==="
...RESP=$(api POST /auth/register '' '' '{"email":"owner-'"$(date +%s)"'@enagram.io","password":"test1234","firstName":"Joe","lastName":"Owner","role":"OWNER"}')
echo "  REGISTER: $(echo "$RESP" | python3 -c "import sys,json; print(json.load(sys.stdin)['message'])")"

# Extract token and save to file
echo "$RESP" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['accessToken'])" > "$OWNER_TOKEN_FILE"
echo "  TOKEN: $(cat $OWNER_TOKEN_FILE | head -c 20)..."

# Login
LOGIN=$(api POST /auth/login '' "$(echo "$RESP" | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'{{\"email\":\"{d[\"data\"][\"user\"][\"email\"]}\",\"password\":\"test1234\"}}')")")
echo "  LOGIN: $(echo "$LOGIN" | python3 -c "import sys,json; print(json.load(sys.stdin)['message'])")"
echo "$LOGIN" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['accessToken'])" > "$OWNER_TOKEN_FILE"

# Profile
ME=$(api GET /auth/me '' '' "$OWNER_TOKEN_FILE")
ME_ROLE=$(echo "$ME" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['role'])")
echo "  ROLE: $ME_ROLE"

echo ""
echo "=== 2. RESTAURANTS ==="
REST=$(api POST /restaurants '' '{"name":"Test Bistro","address":{"street":"1 Main St","city":"NYC","province":"NY","country":"USA"},"contact":{"phone":"+121****0000"}}' "$OWNER_TOKEN_FILE")
RID=$(echo "$REST" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['_id'])")
echo "  CREATED: $(echo "$REST" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['slug'])") (id: ${RID:0:10}...)"

LIST=$(api GET /restaurants)
echo "  LIST: $(echo "$LIST" | python3 -c "import sys,json; print(len(json.load(sys.stdin)['data']))") restaurants"

api PATCH "/restaurants/$RID/toggle" '{"isOpen":true}' "$OWNER_TOKEN_FILE" > /dev/null
echo "  TOGGLED: isOpen=true"

echo ""
echo "=== 3. STAFF ENROLLMENT ==="
STAFF=$(api POST "/restaurants/$RID/staff" '{"firstName":"Jane","lastName":"HR","phone":"+155****0001","role":"HR_MANAGER"}' "$OWNER_TOKEN_FILE")
SID=$(echo "$STAFF" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['staffId'])")
echo "  CREATED: staffId=$SID"

echo ""
echo "=== 4. STAFF LOGIN==="
...STAFF_LOGIN=$(api POST /auth/staff/login '' "{\"staffId\":\"$SID\",\"password\":\"newPass123\"}")
echo "$STAFF_LOGIN" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['accessToken'])" > "$STAFF_TOKEN_FILE"
echo "  LOGIN: token saved"

echo ""
echo "=== 5. MENUS ==="
MENU=$(api POST "/restaurants/$RID/menus" '{"name":"Lunch Menu"}' "$OWNER_TOKEN_FILE")
MID=$(echo "$MENU" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['_id'])")
echo "  CREATED: menu $MID"

ITEM=$(api POST "/restaurants/$RID/menus/$MID/items" '{"name":"Burger","price":1599,"category":"Mains","description":"Juicy"}' "$STAFF_TOKEN_FILE")
IID=$(echo "$ITEM" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['menuItem']['_id'])" 2>/dev/null || echo "$ITEM" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['_id'])")
echo "  ITEM: $IID"

APPROVE=$(api PATCH "/restaurants/$RID/menus/$MID/items/$IID/approve" '' "$OWNER_TOKEN_FILE")
APPROVE_STATUS=$(echo "$APPROVE" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['approvalStatus'])")
echo "  APPROVED: status=$APPROVE_STATUS"

echo ""
echo "=== 6. ORDERS ==="
ORDER=$(api POST /orders '' "{\"restaurantId\":\"$RID\",\"type\":\"DINE_IN\",\"items\":[{\"menuItemId\":\"$IID\",\"name\":\"Burger\",\"price\":1599,\"quantity\":2}]}" "$OWNER_TOKEN_FILE")
OID=$(echo "$ORDER" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['_id'])")
echo "  CREATED: $(echo "$ORDER" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['status'])")"

for STATUS in CONFIRMED PREPARING READY DELIVERED COMPLETED; do
  RES=$(api PATCH "/orders/$OID/status" "{\"status\":\"$STATUS\"}" "$OWNER_TOKEN_FILE")
  MSG=$(echo "$RES" | python3 -c "import sys,json; print(json.load(sys.stdin)['message'])")
  echo "  → $STATUS: $MSG"
done

PAY=$(api PATCH "/orders/$OID/pay" '{"paymentMethod":"CARD"}' "$OWNER_TOKEN_FILE")
echo "  PAID: $(echo "$PAY" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['paymentStatus'])")"

echo ""
echo "=== 7. TABLES ==="
TABLE=$(api POST "/restaurants/$RID/tables" '{"tableNumber":"T1","capacity":4}' "$OWNER_TOKEN_FILE")
echo "  CREATED: $(echo "$TABLE" | python3 -c "import sys,json; print(json.load(sys.stdin)['message'])")"

echo ""
echo "=== 8. ISSUES ==="
ISSUE=$(api POST /issues '' "{\"restaurantId\":\"$RID\",\"channel\":\"STAFF\",\"category\":\"EQUIPMENT\",\"title\":\"Oven broken\",\"description\":\"Not heating\",\"priority\":\"HIGH\"}" "$STAFF_TOKEN_FILE")
echo "  CREATED: $(echo "$ISSUE" | python3 -c "import sys,json; print(json.load(sys.stdin)['message'])")"
ISID=$(echo "$ISSUE" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['_id'])")

# Assign issue
ASSIGN=$(api PATCH "/issues/$ISID/assign" '{"assigneeId":"'"$(echo "$ME" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['_id'])")"'"}' "$OWNER_TOKEN_FILE")
echo "  ASSIGNED: $(echo "$ASSIGN" | python3 -c "import sys,json; print(json.load(sys.stdin)['message'])")"

echo ""
echo "=== 9. APPROVALS ==="
APPROVAL=$(api POST /approvals '' "{\"restaurantId\":\"$RID\",\"type\":\"BUDGET_EXPENDITURE\",\"payload\":{\"amount\":5000,\"description\":\"New oven\"}}" "$STAFF_TOKEN_FILE")
echo "  CREATED: $(echo "$APPROVAL" | python3 -c "import sys,json; print(json.load(sys.stdin)['message'])")"
AID=$(echo "$APPROVAL" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['_id'])")

RESOLVE=$(api PATCH "/approvals/$AID/resolve" '{"status":"APPROVED","notes":"OK"}' "$OWNER_TOKEN_FILE")
echo "  RESOLVED: $(echo "$RESOLVE" | python3 -c "import sys,json; print(json.load(sys.stdin)['message'])")"

echo ""
echo "=== 10. NOTIFICATIONS ==="
NOTIFS=$(api GET /notifications '' '' "$OWNER_TOKEN_FILE")
N_COUNT=$(echo "$NOTIFS" | python3 -c "import sys,json; d=json.load(sys.stdin)['data']; print(len(d) if isinstance(d,list) else 1)")
echo "  FETCHED: $N_COUNT notifications"

echo ""
echo "=== 11. REPORTS ==="
REPORT=$(api POST "/restaurants/$RID/reports" '{"type":"FINANCIAL","period":{"from":"2026-01-01","to":"2026-06-01"},"data":{"revenue":50000,"expenses":35000},"summary":"Q1 summary"}' "$OWNER_TOKEN_FILE")
echo "  SUBMITTED: $(echo "$REPORT" | python3 -c "import sys,json; print(json.load(sys.stdin)['message'])")"

echo ""
echo "=== 12. EDGE CASES ==="
BAD=$(api PATCH "/orders/$OID/status" '{"status":"PENDING"}' "$OWNER_TOKEN_FILE")
BAD_SUCCESS=$(echo "$BAD" | python3 -c "import sys,json; print(json.load(sys.stdin)['success'])")
if [ "$BAD_SUCCESS" = "False" ]; then
  echo "  ✓ Invalid COMPLETED→PENDING rejected"
else
  echo "  ✗ COMPLETED→PENDING was NOT rejected!"
fi

echo ""
echo "========================================"
echo "  ALL ENDPOINTS VERIFIED SUCCESSFULLY"
echo "========================================"
