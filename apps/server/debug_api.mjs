function api(method, path, body, tokenFile) {
  const args = ['-s', '-X', method, BASE + path, '-H', 'Content-Type: application/json'];
  if (body) args.push('-d', JSON.stringify(body));
  if (tokenFile) {
    const token = fs.readFileSync(tokenFile, 'utf8').trim();
    args.push('-H', 'Authorization: Bearer ' + token);
  }
  const proc = spawnSync('curl', args, { encoding: 'utf8', timeout: 10000 });
  if (proc.error) throw new Error(proc.error.message);
  try {
    const parsed = JSON.parse(proc.stdout);
    console.log(`  [DEBUG ${method} ${path}]`, parsed.message, Object.keys(parsed.data || {}).slice(0,5).join(','));
    return parsed;
  }
  catch { throw new Error('Invalid JSON: ' + proc.stdout.substring(0, 100)); }
}
