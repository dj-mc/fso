const fs = require('fs');

const read_utf8_file = (file_path) => {
  return new Promise((resolve, reject) => {
    try {
      fs.readFile(file_path, 'utf8', function read(error, data) {
        if (error) throw error;
        resolve(data);
      });
    } catch (err) {
      reject(err);
    }
  });
};

async function parse_json_file(file_path) {
  const file_data = await read_utf8_file(file_path);
  return JSON.parse(file_data);
}

const overwrite_json_file = (file_path, new_json_data) => {
  fs.writeFile(file_path, JSON.stringify(new_json_data), 'utf8', (err) => {
    if (err) throw err;
    else console.log(`Saved ${new_json_data}!`);
  });
};

module.exports = {
  parse_json_file,
  overwrite_json_file
};
