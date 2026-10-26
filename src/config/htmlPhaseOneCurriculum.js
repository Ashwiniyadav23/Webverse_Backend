const topic = (tag, what, why, how, example, output, mistakes) => ({ tag, what, why, how, example, output, mistakes });
const task = (title, instructions, starterCode, requiredTags, requiredText = []) => ({ title, instructions, starterCode, validation: { requiredTags, requiredText } });
const question = (type, prompt, options, answerIndex, explanation, snippet = "") => ({ type, prompt, options, answerIndex, explanation, snippet });
const assessment = (title, prompt, starterCode, requiredTags, requiredText, testCases, criteria) => ({ title, prompt, starterCode, validation: { requiredTags, requiredText }, testCases, criteria });

const sections = [
  {
    topics: [
      topic("<!DOCTYPE html>", "A declaration at the start of an HTML document.", "It tells browsers to use modern HTML rules.", "Place it before the html element; it has no closing tag.", "<!DOCTYPE html>", "The browser reads the document as modern HTML; the declaration is not shown on the page.", ["Putting it inside head or body.", "Writing a closing doctype tag."]),
      topic("html", "The root element that wraps the whole page.", "It makes the head and body parts of one document.", "Use one html element and set lang to the page language.", '<html lang="en"> ... </html>', "The browser interprets its child elements as the page document.", ["Leaving out the closing html tag.", "Putting body outside html."]),
      topic("head and title", "head contains document information; title names the page.", "A useful title appears in the browser tab and helps identify the page.", "Put title inside head, before body.", "<head><title>Student Home</title></head>", "The tab says Student Home; title text is not the page's visible heading.", ["Putting title in body.", "Using title instead of a visible h1."]),
      topic("body", "The element that contains visible page content.", "It separates what visitors read from document metadata.", "Place headings, paragraphs, and page regions inside body.", "<body><p>Welcome!</p></body>", "Welcome! appears in the page.", ["Putting visible content in head.", "Using multiple body elements in one document."]),
      topic("header, main, footer, h1", "Semantic elements name page regions; h1 names the main topic.", "They give content a clear structure that people and assistive tools can understand.", "Use header for the introduction, one main for central content, footer for closing details, and h1 for the page title.", "<header><h1>Student Portal</h1></header><main><p>Welcome.</p></main><footer>WebVerse</footer>", "A titled page, central welcome, and closing text appear.", ["Putting the main content in footer.", "Using h1 only to make text look large."]),
    ],
    tasks: [
      task("Welcome document", "Write a full document with a title, one h1, and a welcome paragraph.", '<!DOCTYPE html>\n<html lang="en">\n<head><title>Welcome</title></head>\n<body>\n\n</body>\n</html>', ["html", "head", "title", "body", "h1", "p"], ["welcome"]),
      task("Student portal frame", "Add a header, main, and footer around a student portal welcome message.", '<!DOCTYPE html>\n<html lang="en"><head><title>Portal</title></head><body>\n<header><h1>Student Portal</h1></header>\n<!-- Add main and footer -->\n</body></html>', ["header", "h1", "main", "footer"]),
    ],
    quiz: [
      question("mcq", "Which element contains the visible page content?", ["head", "body", "title", "doctype"], 1, "body contains the content shown in the page."),
      question("output", "What does the visitor see in the page body?", ["Only Garden Notes", "Seeds need water.", "Both in the body", "Nothing"], 1, "title labels the tab; the paragraph appears in the page.", "<head><title>Garden Notes</title></head><body><p>Seeds need water.</p></body>"),
      question("error", "Where should the h1 be moved?", ["Into body", "Keep in head", "Into title", "Outside html"], 0, "h1 is visible page content and belongs in body.", "<head><h1>News</h1><title>Daily News</title></head>"),
    ],
    assessment: assessment("About the Learning Hub", "Create a short learning hub page with a valid document, a page title, a welcome heading and paragraph, and a footer naming the school. This task is different from the portal frame practice.", '<!DOCTYPE html>\n<html lang="en">\n<head><title>Learning Hub</title></head>\n<body>\n\n</body></html>', ["html", "head", "title", "body", "h1", "p", "footer"], ["learning hub"], ["The page title is inside head.", "A visitor can see a heading and welcome paragraph.", "The footer contains school information."], ["Valid document structure", "Page title and welcome content", "Footer used for closing information"]),
  },
  {
    topics: [
      topic("nav", "A landmark for important navigation links.", "It helps visitors find the main pages of a site.", "Place a group of links inside nav; give multiple nav elements distinct labels.", '<nav aria-label="Main"><a href="index.html">Home</a></nav>', "A Home link appears as navigation.", ["Using nav for every group of links.", "Putting unrelated page content inside nav."]),
      topic("a and href", "a creates a link; href gives its destination.", "Links connect pages or jump to a section.", "Put a real file path or URL in href and meaningful text between the tags.", '<a href="profile.html">My profile</a>', "My profile is clickable and opens profile.html.", ["Using src instead of href.", "Leaving out link text."]),
      topic("ul, ol, li", "ul is an unordered list, ol an ordered sequence, and li a list item.", "Lists group related items and show when order matters.", "Place each li inside ul or ol.", "<ul><li>Reading</li><li>Music</li></ul>", "A two-item bulleted list appears.", ["Putting text directly in ul.", "Using ol when order does not matter."]),
      topic("Relative file paths", "A path interpreted from the current HTML file's folder.", "Relative paths connect files in a project that can be moved together.", "Use profile.html for a sibling file, pages/profile.html to enter a folder, and ../index.html to move up.", '<a href="../index.html">Home</a>', "The link opens index.html in the parent folder.", ["Resolving the path from the project root instead of current file.", "Ignoring uppercase/lowercase differences."]),
    ],
    tasks: [
      task("Course choices", "Create a navigation menu for a student choosing among three course areas.", '<nav><ul>\n  <!-- Add three links -->\n</ul></nav>', ["nav", "ul", "li", "a", "href"]),
      task("Study plan", "Show a four-step study sequence and a separate unordered list of two study resources.", '<h2>Study sequence</h2>\n<!-- Add lists -->', ["ol", "ul", "li"]),
    ],
    quiz: [
      question("mcq", "Which attribute supplies a link destination?", ["src", "href", "alt", "name"], 1, "href supplies the destination for an anchor link."),
      question("output", "Which text is displayed as the clickable link?", ["guide.html", "Read the guide", "href", "Nothing"], 1, "The content inside the a element is its link text.", '<a href="guide.html">Read the guide</a>'),
      question("error", "A link from pages/profile.html must open sibling index.html. Which path is correct?", ["index.html", "../index.html", "pages/index.html", "/profile.html"], 1, "Move up from pages with ../, then open index.html.", '<a href="index.html">Home</a>'),
    ],
    assessment: assessment("Library route map", "Make a library route map with a nav landmark, links to Catalog and Events, and a numbered three-step visitor sequence. Use placeholder destination files catalog.html and events.html.", '<header><h1>Library route map</h1></header>\n<!-- navigation and visit sequence -->', ["nav", "ul", "li", "a", "ol"], ["catalog.html", "events.html"], ["Both page links are inside nav.", "The visitor sequence has three ordered items.", "Link text describes each destination."], ["Navigation structure", "Working relative destinations", "Ordered visitor sequence"]),
  },
  {
    topics: [
      topic("h1, h2, h3", "Heading tags create levels in a page outline.", "A clear outline helps readers scan and navigate content.", "Use h1 for the page topic, h2 for main sections, and h3 for a subsection under h2.", "<h1>My Profile</h1><h2>Interests</h2><h3>Music</h3>", "Three headings appear in a clear hierarchy.", ["Choosing levels only by their default size.", "Skipping levels without a structural reason."]),
      topic("p", "A paragraph groups prose into a block of related sentences.", "It makes biographical details readable and meaningful.", "Wrap each paragraph in p; use headings for section names.", "<p>I am learning to build websites.</p>", "A separate paragraph appears.", ["Using p as a heading.", "Nesting another p inside p."]),
      topic("img, src, alt", "img embeds an image; src locates it and alt provides a text alternative.", "A useful alt value communicates informative image content if it cannot be seen or loaded.", "Use an image path in src and describe its relevant meaning in alt. img is a void element.", '<img src="images/profile.jpg" alt="Mina at the school garden">', "The photo appears; if unavailable, its alternative text is available.", ["Leaving alt out.", "Using a filename as alt.", "Adding a closing img tag."]),
      topic("strong and em", "strong marks importance; em marks spoken emphasis.", "Meaningful text emphasis adds context beyond appearance.", "Wrap only the words whose meaning is important or emphasized.", "<p><strong>Note:</strong> Bring your notebook.</p>", "Note is shown with strong importance, commonly bold.", ["Using strong only for visual bold.", "Using em when no emphasis is meant."]),
    ],
    tasks: [
      task("Club introduction", "Write a club introduction with a main heading, two section headings, paragraphs, and an informative image with alt text.", '<h1>My Club</h1>\n<!-- Add sections and image -->', ["h1", "h2", "p", "img", "src", "alt"]),
      task("Goal and hobby notes", "Add a goal and hobby section. Use one strong warning or important note and a properly nested heading outline.", '<h1>My Goals</h1>\n<!-- Add h2 sections -->', ["h1", "h2", "p", "strong"]),
    ],
    quiz: [
      question("mcq", "Which heading level is the main page topic?", ["h3", "h2", "h1", "title"], 2, "h1 is the top-level page heading."),
      question("output", "Which phrase is the alternative text if the image cannot display?", ["photo.png", "A red bicycle beside a tree", "Picture", "Nothing"], 1, "alt gives the text alternative for an image.", '<img src="bike.png" alt="A red bicycle beside a tree">'),
      question("error", "What should be fixed in this heading outline?", ["Change h4 to h2", "Change h1 to p", "Remove the paragraph", "Use image for a heading"], 0, "A direct subsection of h1 should normally use h2.", "<h1>Plants</h1><h4>Watering</h4>"),
    ],
    assessment: assessment("Community member card", "Create a short community member profile with an h1, a paragraph, two h2 sections (contribution and next goal), a list of two contributions, and a profile image with useful alt text.", '<!-- Build the community profile -->', ["h1", "h2", "p", "ul", "li", "img", "alt"], ["contribution", "goal"], ["The page has a profile heading and paragraph.", "Contribution and goal sections use headings.", "Image has descriptive alternative text."], ["Heading outline and paragraphs", "Contribution list", "Image source and alt text"]),
  },
  {
    topics: [
      topic("header", "An introductory region for a page or section.", "It identifies the content that begins a region.", "Place a site or section heading and related introduction in header.", "<header><h1>Student Portal</h1></header>", "The portal heading appears in the page header.", ["Using header as a generic wrapper for everything.", "Assuming header automatically creates navigation."]),
      topic("nav", "A landmark for the page's major navigation.", "It lets visitors identify and move through important links.", "Use it for primary page navigation and label multiple navigation areas.", '<nav aria-label="Main navigation"><a href="home.html">Home</a></nav>', "A named navigation area appears.", ["Marking every link group as nav.", "Using nav for unrelated content."]),
      topic("main", "The central, unique content of the page.", "It distinguishes the main topic from repeated page regions.", "Use one main element for the primary content.", "<main><h2>Announcements</h2><p>Welcome.</p></main>", "The central announcement content is grouped in main.", ["Using more than one main visible at once.", "Putting only the header in main."]),
      topic("section and footer", "section groups a related topic; footer contains closing or ownership details.", "Meaningful regions make long pages easier to understand.", "Give sections headings; use footer for contact, ownership, or closing information.", "<section><h2>Hours</h2><p>Open daily.</p></section>", "A headed hours section appears.", ["Using section with no topic or heading.", "Putting primary content in footer."]),
    ],
    tasks: [
      task("Museum page outline", "Create a museum page with header, nav, main, two headed sections, and footer.", '<!-- Add semantic page regions -->', ["header", "nav", "main", "section", "h2", "footer"]),
      task("Page structure repair", "Fix the outline so primary page content is in one main, navigation is in nav, and closing contact details are in footer.", '<header><h1>Garden</h1></header>\n<div><a href="hours.html">Hours</a><p>Open daily</p></div>\n<p>Contact us</p>', ["nav", "main", "footer"]),
    ],
    quiz: [
      question("mcq", "Which element should contain the main unique page content?", ["footer", "main", "title", "nav"], 1, "main identifies the central content."),
      question("output", "How many headed sections are in this structure?", ["One", "Two", "Three", "None"], 1, "There are two section elements, each with an h2.", "<main><section><h2>Hours</h2></section><section><h2>Location</h2></section></main>"),
      question("error", "A contact link group is mixed into the article body. Which element should identify the important page links?", ["nav", "footer", "title", "tbody"], 0, "nav identifies a significant group of navigation links."),
    ],
    assessment: assessment("Community notice page", "Structure a community notice with site header, labeled navigation, one main area, two headed sections (Schedule and Place), and a footer contact line. Keep each region at the appropriate level.", '<!-- Build a semantic community notice -->', ["header", "h1", "nav", "main", "section", "h2", "footer"], ["schedule", "place", "contact"], ["The page has one main region.", "Each section has its own heading.", "Navigation links are kept in nav."], ["Landmarks used for their purpose", "Headed sections", "Closing contact information"]),
  },
  {
    topics: [
      topic("form", "A container for related input controls.", "It groups the information a visitor provides.", "Put related controls and a submit button inside form; explain where practice submissions go.", '<form action="#" method="get">...</form>', "The browser presents a form; this demo does not store responses without a service.", ["Promising data is stored when no handler exists.", "Putting unrelated controls outside the form."]),
      topic("label and input", "label names a control; input collects a value.", "Labels make each field understandable and accessible.", "Match label for with a unique input id. Choose text, email, radio, or checkbox for the value type.", '<label for="email">Email</label><input id="email" name="email" type="email" required>', "The visitor sees a labeled email field that the browser requires.", ["Using placeholder as the only label.", "Mismatched for/id values.", "Giving radio options different names when only one should be selected."]),
      topic("textarea, select, option", "textarea accepts longer text; select offers options.", "They fit a message and a controlled choice.", "Give each a label and name; place option elements inside select.", '<label for="message">Message</label><textarea id="message" name="message"></textarea>', "A labeled multiline message field appears.", ["Putting option outside select.", "Using input when a multi-line message is required."]),
      topic("button, name, required", "A submit button sends a form; name identifies a value and required asks for one.", "These help browsers and form handlers interpret the user's choices.", "Use button type=submit and meaningful unique name values; mark only necessary fields required.", '<button type="submit">Send feedback</button>', "The form displays a clearly named submit button.", ["Leaving button type ambiguous.", "Using required on every optional field."]),
    ],
    tasks: [
      task("Workshop signup form", "Build a labeled signup form with name/email, one radio group, and a submit button.", '<form action="#" method="post">\n<!-- Add labeled controls -->\n</form>', ["form", "label", "input", "email", "radio", "name", "button"], ["submit"]),
      task("Feedback options", "Add a labeled dropdown, a checkbox, and a multi-line message field to a feedback form.", '<form action="#" method="post">\n<!-- Add feedback choices -->\n</form>', ["form", "select", "option", "checkbox", "textarea", "label"]),
    ],
    quiz: [
      question("mcq", "Which attribute connects a label to an input?", ["href", "for matched to id", "src", "value"], 1, "The label's for value must match the control's id."),
      question("output", "What happens when a blank required email is submitted normally?", ["The browser asks for a value", "It creates a label", "It submits an empty value", "It stores the response"], 0, "required invokes browser validation; it does not store a response.", '<input name="email" type="email" required>'),
      question("error", "Which attribute identifies a submitted field's key?", ["id", "name", "for", "class"], 1, "name identifies the field in submitted form data."),
    ],
    assessment: assessment("Library visit request", "Build an accessible library visit request form with labeled name and email, a select with at least two visit types, a message textarea, a required email field, and a submit button. Explain on the page that this is a practice form and does not deliver responses.", '<form action="#" method="post">\n<!-- Add the request fields -->\n</form>', ["form", "label", "input", "email", "select", "option", "textarea", "required", "button"], ["practice form", "does not deliver"], ["All controls have visible matching labels.", "The email field is required.", "The practice limitation is explained."], ["Accessible labels and names", "Appropriate controls and validation", "Honest submission explanation"]),
  },
  {
    topics: [
      topic("table and caption", "table groups data in rows and columns; caption describes it.", "A caption tells readers what the data represents.", "Put a short descriptive caption directly inside table.", "<table><caption>Term grades</caption>...</table>", "The table is identified as Term grades.", ["Using tables only to arrange page layout.", "Leaving the table without a meaningful caption."]),
      topic("thead, tbody, tfoot", "These elements group table header, data, and summary rows.", "They give the table a clear organization.", "Place tr rows inside the correct section elements.", "<tbody><tr><td>HTML</td><td>A</td></tr></tbody>", "A data row appears in the table body.", ["Putting td directly inside tbody.", "Using tfoot for ordinary data rows."]),
      topic("tr, th, td", "tr creates a row; th identifies a heading; td contains data.", "Correct cells help readers associate values with labels.", "Put th or td inside tr; use th for column names and row headings.", "<tr><th>Course</th><td>HTML</td></tr>", "A heading and its value appear in one row.", ["Using td for every heading.", "Putting cells outside tr."]),
    ],
    tasks: [
      task("Reading log", "Create a table of three books with a caption and columns for title and pages.", '<table>\n<caption>Reading log</caption>\n<!-- Add head and body -->\n</table>', ["table", "caption", "thead", "tbody", "tr", "th", "td"]),
      task("Club attendance summary", "Create a table with two attendance rows and a footer row that summarizes the total.", '<table><caption>Club attendance</caption>\n<!-- Add table sections -->\n</table>', ["table", "caption", "thead", "tbody", "tfoot", "tr", "th", "td"]),
    ],
    quiz: [
      question("mcq", "Which cell element identifies a row or column heading?", ["td", "th", "tr", "caption"], 1, "th identifies a table heading."),
      question("output", "How many data rows are in tbody?", ["One", "Two", "Three", "Zero"], 1, "tbody contains two tr elements.", "<tbody><tr><td>A</td></tr><tr><td>B</td></tr></tbody>"),
      question("error", "Where should a td cell be placed?", ["Directly inside table", "Inside tr", "Inside caption", "Inside thead without tr"], 1, "Table cells belong inside a table row."),
    ],
    assessment: assessment("Workshop schedule table", "Create a workshop schedule table with a useful caption, column headings for session/time/room, two schedule rows, and a footer that states the total number of sessions.", '<table>\n<!-- Build schedule -->\n</table>', ["table", "caption", "thead", "tbody", "tfoot", "tr", "th", "td"], ["session", "time", "room", "total"], ["The caption describes the schedule.", "Column labels are in table header rows.", "Footer reports the total number of sessions."], ["Table grouping and caption", "Correct row and cell structure", "Useful summary footer"]),
  },
];

module.exports = sections;
