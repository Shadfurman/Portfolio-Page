fetch('blog_summaries.json')
  .then(response => response.json())
  .then(blogSummaries => {
    blogSummaries.forEach(blog => {
        const div = document.createElement('article');
        div.className = 'blog-entry'
        const link = document.createElement('a');
        link.textContent = blog.title;
        link.href = blog.link;

        const summary = document.createElement('p');
        summary.textContent = blog.summary;

        // Append the link to the appropriate container in your HTML
        const blogElement = document.getElementById('blog-list');
        div.appendChild(link);
        div.appendChild(summary);
        blogElement.appendChild(div);
    });
  })
  .catch(error => console.error(`Error fetching blog summaries: ${error}`));

function toggleVisibility(elementId) {
    
    var element = document.getElementById(elementId);
    if (element.style.display === "none") {
        element.style.display = "block";
    } else {
        element.style.display = "none";
    }
}



const container = document.getElementById("matrix-container");
const numberOfColumns = 50;
const columnHeight = 20;
const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[{]}\\|;:'\",<.>/?`~";

function randomCharacter() {
  return characters[Math.floor(Math.random() * characters.length)];
}

function createColumn() {
    const column = document.createElement("div");
    column.classList.add("matrix-column");
  
    // Set a random horizontal position
    const position = Math.random() * 100;
    column.style.left = `${position}%`;
  
    // Set a random initial bottom value
    const initialBottom = Math.random() * (100 + columnHeight * 1.5);
    column.style.bottom = `${initialBottom}%`;
  
    // Generate random characters for the column
    for (let i = 0; i < columnHeight; i++) {
      const char = document.createElement("span");
      char.textContent = randomCharacter();
      char.style.opacity = (i + 1) / columnHeight;
      column.appendChild(char);
    }
  
    return column;
  }

// Create and append columns
for (let i = 0; i < numberOfColumns; i++) {
  const column = createColumn();
  container.appendChild(column);
}

// Update columns with random characters and falling effect
function updateColumns() {
  const columns = document.querySelectorAll(".matrix-column");

  columns.forEach(column => {
    // Move column down
    const columnBottom = parseFloat(column.style.bottom, 10) + 20;
    // const newBottom = (columnBottom - 1 + 100 + columnHeight) % (100 + columnHeight);
    let newBottom = ((100 + columnBottom - .7) % 100) - 20;
    newBottom = newBottom.toFixed(2);
    column.style.bottom = `${newBottom}%`;

    // Update characters randomly
    if (Math.random() < 1) {
      const index = Math.floor(Math.random() * columnHeight);
      column.children[index].textContent = randomCharacter();
    }
  });

//   requestAnimationFrame(updateColumns);
  setTimeout(() => {requestAnimationFrame(updateColumns);}, 100);
}

updateColumns();
