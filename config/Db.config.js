const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://falguniray97:nvQma3qAk1LUJize@socialmediaapp.iisyyvt.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});
