const puppeteer = require('puppeteer');

async function scrapeModelContextProtocol() {
  console.log('Starting browser...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Configure viewport
  await page.setViewport({ width: 1280, height: 800 });
  
  try {
    // First navigate to GitHub MCP repository
    console.log('Navigating to GitHub MCP repository...');
    await page.goto('https://github.com/microsoft/model-context-protocol', { waitUntil: 'networkidle2' });
    
    // Take a screenshot of the repository page
    await page.screenshot({ path: './mcp-github-repo.png' });
    
    // Extract repository description
    const repoDescription = await page.evaluate(() => {
      const aboutSection = document.querySelector('div[data-repository-hovercards-enabled]');
      return aboutSection ? aboutSection.textContent.trim() : 'Description not found';
    });
    
    console.log('Repository Description:');
    console.log(repoDescription);
    
    // Navigate to the MCP documentation
    console.log('\nNavigating to MCP documentation...');
    await page.goto('https://github.com/microsoft/model-context-protocol/blob/main/docs/protocol/README.md', { waitUntil: 'networkidle2' });
    
    // Extract documentation content
    const docContent = await page.evaluate(() => {
      const article = document.querySelector('article.markdown-body');
      return article ? article.textContent.trim() : 'Documentation content not found';
    });
    
    console.log('MCP Documentation Overview:');
    console.log(docContent.substring(0, 500) + '...');
    
    // Navigate to Microsoft Learn page for MCP (if available)
    console.log('\nSearching for MCP on Microsoft Learn...');
    await page.goto('https://learn.microsoft.com/en-us/search/?terms=model%20context%20protocol', { waitUntil: 'networkidle2' });
    
    // Take a screenshot of the search results
    await page.screenshot({ path: './mcp-mslearn-search.png' });
    
    // Extract search results
    const searchResults = await page.evaluate(() => {
      const results = document.querySelectorAll('.search-results-list-item');
      return Array.from(results).map(item => item.textContent.trim()).join('\n\n');
    });
    
    console.log('Microsoft Learn Search Results:');
    console.log(searchResults || 'No specific search results found');
    
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    // Close the browser
    await browser.close();
    console.log('\nBrowser closed. Scraping completed.');
  }
}

scrapeModelContextProtocol();