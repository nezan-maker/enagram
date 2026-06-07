import 'mongoose';
describe('repro', () => {
  it('create then save should work', async () => {
    const mongoose = (await import('mongoose')).default;
    const { Schema } = mongoose;
    
    // Minimal model
    const schema = new Schema({ name: String, token: String });
    const Model = mongoose.model('Repro', schema);
    
    const doc = await Model.create({ name: 'test' });
    console.log('Created:', doc._id);
    doc.token = 'abc123';
    await doc.save();
    console.log('Saved OK');
    
    const found = await Model.findById(doc._id);
    console.log('Found:', !!found, 'token:', found?.token);
  });
});
