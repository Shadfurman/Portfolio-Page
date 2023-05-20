const fs = require('fs').promises;
const path = require('path');
const { JSDOM } = require('jsdom');

const blogDir = './blog';
const outputFile = './blog_summaries.json';

async function readAndParseFile(file) {
  const link = path.join(blogDir, file);
  const data = await fs.readFile(link, 'utf8');

  const dom = new JSDOM(data);

  const titleElement = dom.window.document.querySelector('title');
  if (!titleElement) {
    throw new Error(`File ${file} is missing a title element`);
  }
  const title = titleElement.textContent;

  const summaryElement = dom.window.document.querySelector('.summary');
  if (!summaryElement) {
    throw new Error(`File ${file} is missing a summary element`);
  }
  const summary = summaryElement.textContent;

  const dateElement = dom.window.document.querySelector('.date');
  if (!dateElement) {
    throw new Error(`File ${file} is missing a date element`);
  }
  let dateText = dateElement.textContent.replace(/Posted on/i, '').trim();

  const createdDate = new Date(dateText);
  if (isNaN(createdDate.getTime())) {
    throw new Error(`Invalid date in file ${file}: ${dateText}`);
  }

  return {
    file,
    title,
    summary,
    link,
    createdDate
  };
}


async function main() {
  try {
    const files = await fs.readdir(blogDir);
    const htmlFiles = files.filter(file => path.extname(file) === '.html');

    const blogSummaries = await Promise.all(htmlFiles.map(readAndParseFile));

    blogSummaries.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

    await fs.writeFile(outputFile, JSON.stringify(blogSummaries, null, 2));

    console.log(`Blog summaries written to ${outputFile}`);
  } catch (err) {
    console.error(`Error: ${err}`);
  }
}

main();







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
//   let blogSummaries = [];
//   console.log("Found HTML files: ", htmlFiles);

//   htmlFiles.forEach((file, index) => {

//     const link = path.join(blogDir, file);
//     try {
//       var stats = fs.statSync(link);
//       createdDate = stats.birthtime;
//     } catch (err) {
//       console.log(err);
//     }
//     fs.readFile(link, 'utf8', (err, data) => {
//       if (err) {
//         console.error(`Error reading file: ${err}`);
//         return;
//       }

//       const dom = new JSDOM(data);
//       const title = dom.window.document.querySelector('title').textContent;
//       const summary = dom.window.document.querySelector('.summary').textContent;
//       console.log("Reading file data, ", file);

//       blogInfo = {
//         file,
//         title,
//         summary,
//         link,
//         createdDate
//       }
//       console.log("Creating DOM object", blogInfo);
//       blogSummaries.push(blogInfo);
//     });
//   });

//   blogSummaries.sort(function (a, b) {
//     return new Date(b.createdDate) - new Date(a.createdDate);
//   });
//   console.log("Sorted blog summaries", blogSummaries);

//   fs.writeFile(outputFile, JSON.stringify(blogSummaries, null, 2), err => {
//     if (err) {
//       console.error(`Error writing JSON file: ${err}`);
//     } else {
//       console.log(`Blog summaries written to ${outputFile}`);
//     }
//   });
// });





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
