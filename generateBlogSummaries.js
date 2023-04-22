const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const blogDir = './blog';
const outputFile = './blog_summaries.json';

fs.readdir(blogDir, (err, files) => {
  if (err) {
    console.error(`Error reading directory: ${err}`);
    return;
  }

  const htmlFiles = files.filter(file => path.extname(file) === '.html');
  const blogSummaries = [];

  htmlFiles.forEach((file, index) => {
    fs.readFile(path.join(blogDir, file), 'utf8', (err, data) => {
      if (err) {
        console.error(`Error reading file: ${err}`);
        return;
      }

      const dom = new JSDOM(data);
      const title = dom.window.document.querySelector('title').textContent;
      const summary = dom.window.document.querySelector('.summary').textContent;
      const link = path.join(blogDir, file);

      blogSummaries.push({
        file,
        title,
        summary,
        link
      });

      if (index === htmlFiles.length - 1) {
        fs.writeFile(outputFile, JSON.stringify(blogSummaries, null, 2), err => {
          if (err) {
            console.error(`Error writing JSON file: ${err}`);
          } else {
            console.log(`Blog summaries written to ${outputFile}`);
          }
        });
      }
    });
  });
});





// const fs = require('fs');
// const path = require('path');
// const { JSDOM } = require('jsdom');

// const blogDir = './blog';
// const outputFile = './blog_summaries.json';

// fs.readdir(blogDir, (err, files) => {
//   if (err) {
//     console.error(`Error reading directory: ${err}`);
//     return;
//   }

//   const htmlFiles = files.filter(file => path.extname(file) === '.html');
//   const blogSummaries = [];

//   htmlFiles.forEach((file, index) => {
//     fs.readFile(path.join(blogDir, file), 'utf8', (err, data) => {
//       if (err) {
//         console.error(`Error reading file: ${err}`);
//         return;
//       }

//       const dom = new JSDOM(data);
//       const title = dom.window.document.querySelector('title').textContent;
//       const summary = dom.window.document.querySelector('.summary').textContent;

//       blogSummaries.push({
//         file,
//         title,
//         summary
//       });

//       if (index === htmlFiles.length - 1) {
//         fs.writeFile(outputFile, JSON.stringify(blogSummaries, null, 2), err => {
//           if (err) {
//             console.error(`Error writing JSON file: ${err}`);
//           } else {
//             console.log(`Blog summaries written to ${outputFile}`);
//           }
//         });
//       }
//     });
//   });
// });
