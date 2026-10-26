const Course = require("../models/Course");
const Lesson = require("../models/Lesson");

async function seedHtmlFundamentals() {
  const title = "HTML Fundamentals";
  let course = await Course.findOne({ title });
  if (!course) {
    course = await Course.create({
      title,
      description: "A beginner-friendly HTML course with four milestones, practical projects, an HTML-only portfolio capstone, and MDN references.",
      classLevel: 8,
      subject: "Computer Science",
      category: "Web Development",
      published: true,
    });
  }

  course.description = "A beginner-friendly HTML course with four milestones, practical projects, an HTML-only portfolio capstone, and MDN references.";
  course.published = true;
  await course.save();

  const existing = await Lesson.countDocuments({ course: course._id });

  const milestones = [
    {
      module: "Milestone 1: HTML Fundamentals",
      title: "HTML Fundamentals and Projects",
      description: "Structure documents, format text, and use common HTML elements.",
      content: `Topics: HTML structure; tags, elements, and attributes; headings and paragraphs; text formatting; div and span; ordered and unordered lists.\n\nSyntax:\n<tag attribute=\"value\">Content</tag>\n\nExample:\n<!doctype html>\n<html lang=\"en\"><head><meta charset=\"utf-8\"><title>About Me</title></head><body><h1>About Sam</h1><p>I enjoy <strong>building things</strong>.</p><ul><li>Reading</li><li>Cooking</li></ul></body></html>\n\nPractical tasks (separate deliverables):\n1. Create an About Me page with headings, paragraphs, formatting, div/span, and a list.\n2. Create a Restaurant Menu with sections, item descriptions, and prices.\n3. Create a Wikipedia-style article with an introduction, contents list, headings, and factual paragraphs.\n\nInterview Q&A:\nQ: What is the difference between a tag and an element? A: Tags are the opening/closing markup; an element includes those tags and its content.\nQ: When should div and span be used? A: As generic block and inline containers when no semantic element fits.\nQ: How do ol and ul differ? A: ol indicates sequence; ul indicates an unordered collection.`,
      documentUrl: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Basic_HTML_syntax",
      resources: [{ title: "HTML elements reference", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element", type: "document" }],
      duration: "45 min",
    },
    {
      module: "Milestone 2: Links, Images, Tables & Multimedia",
      title: "Links, Images, Tables, and Media",
      description: "Connect pages and present visual and tabular information accessibly.",
      content: `Topics: links and href; images and alt text; relative file paths; tables with headers; basic audio, video, and embeds.\n\nSyntax:\n<a href=\"about.html\">About</a>\n<img src=\"images/photo.jpg\" alt=\"A red kite in the sky\">\n<table><tr><th scope=\"col\">Name</th><td>Ada</td></tr></table>\n\nExample: Use figure/figcaption for an image and caption; use caption, th, and scope to make data tables understandable.\n\nPractical tasks (separate deliverables):\n1. Create an Image Gallery with at least four images, descriptive alt text, captions, and relative paths.\n2. Create a Student Report Card using a caption, row/column headers, marks, and a summary.\n3. Create a Travel Blog with images, useful links, and an embedded video or map with a descriptive title.\n\nInterview Q&A:\nQ: Why does an informative image need alt text? A: It communicates the image's meaning when the image cannot be seen or loaded.\nQ: What is a relative path? A: A path resolved from the current document, such as images/photo.jpg.\nQ: How can table headers be associated with data? A: Use th with scope=\"row\" or scope=\"col\".`,
      documentUrl: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/HTML_table_basics",
      resources: [
        { title: "Creating hyperlinks", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Creating_links", type: "document" },
        { title: "Images in HTML", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img", type: "document" },
        { title: "Audio element", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio", type: "document" },
        { title: "Video element", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video", type: "document" },
        { title: "Iframe element", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe", type: "document" },
      ],
      duration: "50 min",
    },
    {
      module: "Milestone 3: HTML Forms, Semantics & Accessibility",
      title: "HTML Forms, Semantics, and Accessibility",
      description: "Build useful forms and understandable pages with accessible structure.",
      content: `Topics: forms, inputs, labels, buttons; action and method; name, required, and autocomplete; semantic elements; accessibility basics.\n\nSyntax:\n<form action=\"/apply\" method=\"post\"><label for=\"email\">Email</label><input id=\"email\" name=\"email\" type=\"email\" required><button type=\"submit\">Send</button></form>\n\nExample: Use header, nav, main, article/section, and footer to describe page regions.\n\nPractical tasks (separate deliverables):\n1. Create a Student Registration Form with labeled fields, suitable types, and required values.\n2. Create a Job Application Form with contact, role, experience, and optional resume fields.\n3. Create an FAQ page using details and summary for at least five questions.\n\nInterview Q&A:\nQ: Why should every form control have a label? A: Labels provide an accessible name and a larger click target.\nQ: What does name do? A: It identifies the submitted form value.\nQ: Name common semantic landmarks. A: header, nav, main, and footer.`,
      documentUrl: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Your_first_form",
      resources: [
        { title: "HTML forms guide", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms", type: "document" },
        { title: "HTML elements reference", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element", type: "document" },
      ],
      duration: "50 min",
    },
    {
      module: "Milestone 4: Layout & Final Project",
      title: "Page Structure and Portfolio Project",
      description: "Read page structure, organize files, and build a complete HTML-only portfolio.",
      content: `Topics: semantic page layout; reading existing HTML; indentation and nesting; file organization; HTML-only project structure.\n\nSyntax:\n<header>...</header><nav>...</nav><main><section>...</section><article>...</article></main><footer>...</footer>\n\nExample file organization:\nportfolio/index.html, portfolio/pages/projects.html, portfolio/images/profile.jpg\n\nPractical tasks (separate deliverables):\n1. Recreate a webpage structure from a reference by identifying its header, navigation, content sections, and footer.\n2. Analyze existing HTML and identify the document title, landmarks, headings, links, images, controls, and nesting.\n3. Final project: build a complete Personal Portfolio Website using HTML only, with about, skills, projects, contact details/form, semantic landmarks, and organized assets. HTML-only means no CSS or JavaScript is required.\n\nInterview Q&A:\nQ: What belongs in main? A: The page's dominant, unique content; normally one visible main per page.\nQ: How do section and article differ? A: section groups a theme; article is self-contained content that can stand alone.\nQ: Why organize image assets? A: Predictable paths make projects easier to navigate and maintain.`,
      documentUrl: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Structuring_a_page_of_content",
      resources: [{ title: "HTML elements reference", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element", type: "document" }],
      duration: "60 min",
    },
    {
      module: "Final Project: Personal Portfolio Website",
      title: "Final Project: Personal Portfolio Website",
      description: "Plan, build, submit, and improve an accessible HTML-only portfolio using Milestones 1–3.",
      content: `# Personal Portfolio Website — Final Project\n\nBuild a portfolio that introduces you and presents your work. This project checks HTML only. CSS and JavaScript are not required. Do not copy a finished template: make the content and code your own.\n\n## Work in six stages\n1. Plan: sketch the page sections and make a folder plan. Checkpoint: identify the main page file and the assets it will need.\n2. Build the document and semantic frame: add the doctype, language, metadata, header, nav, main, sections, and footer. Checkpoint: the page has a useful browser-tab title and a clear heading outline.\n3. Add your introduction: paragraphs, meaningful text formatting, interests and skills using ordered and unordered lists. Checkpoint: both list types have a sensible purpose.\n4. Add navigation and projects: internal and external links; at least three projects with images, meaningful alt text, descriptions, and links. Organize assets and check relative paths. Checkpoint: open each link and verify every image loads.\n5. Add education and media: an education data table with a caption and appropriate headers; include audio, video, or an embedded item with controls or a descriptive title. Checkpoint: headers identify the data and media has an accessible name or fallback.\n6. Add contact and review: name, email, subject, and message with associated labels, suitable types, name, required, and autocomplete where appropriate; clear instructions; keyboard and markup review. Checkpoint: test required fields and assemble your README and assets.\n\n## Requirements\nUse a correct HTML document; include about, interests, skills, navigation, three or more projects, education table, multimedia, contact form, semantic landmarks, and accessible text alternatives/instructions. Keep HTML and assets organized in a project folder. Include README.md with a short explanation and local run instructions. Submit HTML files, README, and all referenced assets.\n\n## Hints\nStart with a page outline before markup. Use headings to name sections. A link to #projects must match an id on the page. For paths, count from the HTML file containing the reference. An informative image needs alt text that communicates its purpose. Use table headers for relationships, not for visual boldness. Label every form control and do not rely on placeholder text as its label. Use a GET form only when appropriate; a static portfolio contact form may document its intended endpoint if no server endpoint is provided.\n\n## Final checklist\n[ ] HTML opens locally and has a title and language. [ ] Header, nav, main, sections, footer are used appropriately. [ ] About, interests, skills and both list types are present. [ ] Internal/external links work. [ ] Three projects each have an image, meaningful alt, description and link. [ ] Education table has caption and headers. [ ] Audio/video/embed is usable and titled or has fallback. [ ] Contact fields have associated labels, names, suitable types, required/autocomplete where appropriate, and instructions. [ ] README and all referenced assets are included. [ ] No CSS or JavaScript is needed.\n\n## Evaluation (100 marks)\nHTML document structure and semantics 15; headings, paragraphs, formatting and lists 10; links, images and relative paths 15; tables and multimedia 10; forms and input attributes 20; accessibility 15; HTML correctness and organization 10; project explanation and completion 5. The evaluator reports marks, satisfied and missing criteria, detectable errors, and next steps. Revise and resubmit as often as needed. A completed status requires all rubric criteria to pass.\n\n## Interview review\nQ: Why use semantic landmarks? A: They name major page regions and help users navigate.\nQ: Why is alt text important? A: It communicates informative image content when the image is unavailable or cannot be seen.\nQ: Why use table headers? A: They let readers associate each value with its row or column meaning.\nQ: What does a form control's name do? A: It supplies the key used when its value is submitted.\nQ: What should a README include? A: What the project contains and how to open/run it locally.`,
      documentUrl: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content",
      resources: [{ title: "MDN: HTML elements reference", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element", type: "document" }],
      duration: "Project",
    },
  ];

  milestones[0].content += `

TOPIC-BY-TOPIC LEARNING

1. Document Structure
An HTML document has a doctype, an html root, a head for metadata such as character encoding and title, and a body for visible content. Set lang on html to identify the document language.
Syntax: <!doctype html><html lang="en"><head><meta charset="utf-8"><title>Page title</title></head><body>Visible content</body></html>
Example output: The title appears in the browser tab; a body heading and paragraph appear in the page.
Use this structure for every standalone HTML page. Common mistakes: placing visible content in head, omitting the doctype, or expecting title text to appear in the body.
Practice: Create a page titled My Hometown with one heading and one sentence.

2. Tags, Elements, and Attributes
Tags are markup such as <p> and </p>. An element includes tags and its content. Attributes add information to an opening tag as name/value pairs; quote their values. Void elements such as img and meta do not have closing tags.
Syntax: <a href="/about">About us</a>
Example output: About us appears as clickable link text and opens the href destination.
Use attributes to configure elements. Common mistakes: putting an attribute outside the opening tag, confusing the attribute with its visible text, or adding a closing tag to img.
Practice: Create a link to a page using href and meaningful link text.

3. Headings and Paragraphs
Use h1 through h6 to represent the hierarchy of a page outline, and p for prose. Choose heading levels by structure, not by default font size.
Syntax: <h1>Page topic</h1><h2>Section</h2><p>A related explanation.</p>
Example output: A large top-level heading, a smaller section heading, and a paragraph with browser-default spacing.
Use headings to make content scannable and expose an outline. Common mistakes: selecting headings only for their size, skipping levels without reason, or using headings for non-heading text.
Practice: Write one h1, two h2 section headings, and a paragraph under each.

4. Text Formatting
strong communicates strong importance; em communicates emphasis; b draws attention without adding importance; i marks an alternate voice or term; mark highlights text relevant to the current context. Browsers commonly render these with bold, italic, or highlighted appearance.
Syntax: <strong>Warning</strong>, <em>whole</em>, <mark>search term</mark>
Example output: Warning usually appears bold, whole emphasized, and search term highlighted.
Use meaning-bearing formatting when it fits. Common mistakes: using strong or em only for visual styling.
Practice: Write a safety note with a strong warning and an emphasized action.

5. div and span
div is a generic block container for related content; span is a generic inline container for a short phrase. Neither carries meaning or visual styling by itself. Prefer a more meaningful element when one fits.
Syntax: <div><p>Office hours: <span>Tuesday, 2–4 pm</span></p><p>Room 12</p></div>
Example output: Two paragraphs appear on separate lines, while the time remains inline in the first paragraph.
Use these containers as grouping hooks. Common mistakes: using div for every element, expecting span to start a new line, or expecting either to style content automatically.
Practice: Group contact details in div and wrap only the hours phrase in span.

6. Ordered and Unordered Lists
Use ul for a collection whose order does not matter and ol for a sequence. Put each entry in an li. Nested lists belong inside the relevant li.
Syntax: <ul><li>Apples</li><li>Oranges</li></ul> and <ol><li>Preheat</li><li>Mix</li></ol>
Example output: The ul displays bullets; the ol displays numbered steps.
Use ol for instructions and ul for ingredients or collections. Common mistakes: placing bare text directly in a list or choosing a list type only by marker appearance.
Practice: Make a three-step ordered routine and an unordered list of favorite foods.

PRACTICAL ASSIGNMENT REQUIREMENTS AND SELF-EVALUATION
About Me page: useful document title and language; one main heading; short personal paragraphs; meaningful text formatting; related content grouped in div; one inline detail in span; unordered interests/skills list. Evaluate valid document structure, outline, semantic formatting, correct block/inline use, and valid list nesting.
Restaurant Menu: restaurant name; at least two sections; at least three items per section with descriptions and prices; appropriate headings, paragraphs, and at least one list; meaningful text emphasis. Evaluate logical heading hierarchy, readable entries, valid list nesting, and meaningful formatting.
Wikipedia-style article: original factual introduction; at least three heading/paragraph sections; numbered contents list naming each section; unordered related facts where useful; meaningful formatting. Evaluate a clear outline, original explanations, appropriate list types, and valid nesting.
No finished assignment solution is included; students create their own code.

Quiz topics include a multiple-choice check, a predict-the-output challenge, a find-and-fix task, and a code challenge for each topic. Hints are optional; explanations are revealed by the student lesson after answer submission. A score of 75% passes a topic. Students pass all six topic quizzes and self-check the assignment criteria to complete this milestone.`;

  milestones[1].content += `

TOPIC-BY-TOPIC LEARNING

1. Links and href
The a element creates a link; href supplies its destination. Link text is the visible and accessible name. Use a descriptive label. A fragment link such as #hours jumps to an element with id="hours".
Syntax: <a href="https://example.org/guide">Read the visitor guide</a>
Example output: The visitor guide text appears as a clickable link and opens its destination.
Use links to connect project pages, external resources, and sections within a page. Common mistakes: omitting href, using vague link text, or linking to an id that does not exist.
Practice: Add an internal link to a section and a descriptive link to an external resource.

2. Images and alt text
The img element displays an image from src. Give informative images alt text that explains their relevant meaning. Use alt="" for purely decorative images. Use figure and figcaption for a visible caption.
Syntax: <img src="images/garden.jpg" alt="A path between rows of flowers">
Example output: The image appears with its caption; alt text can substitute if the image fails to load.
Use alt for people who cannot see an informative image. Common mistakes: missing alt, using a filename as the description, or repeating the nearby caption without adding information.
Practice: Describe an informative image in alt and add a figure caption.

3. Relative file paths
A relative path starts from the current HTML file. Use folder/file.ext to enter a child folder and ../ to move up one folder. Match names and capitalization.
Syntax: In index.html, use images/photo.jpg. In pages/trip.html, use ../images/photo.jpg when images is a sibling of pages.
Example output: Both pages display the same image; the nested page path starts with ../.
Use paths to keep local project pages and assets connected. Common mistakes: counting from the project root instead of the current page, wrong file extension, or wrong capitalization.
Practice: Draw a folder tree and write paths from both its root page and a nested page.

4. Tables with headers
Use tables for row-and-column data. Add a caption, th header cells, td data cells, and scope="col" or scope="row" to clarify relationships. Use thead and tbody to group rows.
Syntax: <table><caption>Scores</caption><tr><th scope="col">Name</th><th scope="col">Score</th></tr><tr><th scope="row">Mina</th><td>92</td></tr></table>
Example output: A caption, two labeled columns, and a data row; default borders depend on browser styling.
Use tables for report cards and schedules, not page layout. Common mistakes: making every cell td, inconsistent column counts, or omitting a caption and header relationships.
Practice: Build a two-column subject/score table with row and column headings.

5. Audio, video, and embedded content
audio and video can play media files; controls exposes the browser's playback UI. Use source and fallback text for video formats. iframe embeds another page or service and needs a descriptive title. Only embed trusted sources.
Syntax: <audio controls src="media/intro.mp3">Audio is unavailable.</audio>
Syntax: <video controls><source src="media/clip.mp4" type="video/mp4">Video is unavailable.</video>
Syntax: <iframe title="Map of the city center" src="...map URL..."></iframe>
Example output: A media player with controls or a titled embedded map; files and remote maps must be reachable.
Use media for recorded audio/video and an iframe for a separate map or service. Common mistakes: omitting controls, broken asset paths, missing iframe title, or embedding an untrusted page.
Practice: Add an audio player with fallback text and a titled map iframe.

PRACTICAL ASSIGNMENT REQUIREMENTS AND SELF-EVALUATION
Image Gallery: at least six images; meaningful alt on informative images and empty alt on decorative images; captions where useful; assets in a folder with correct relative paths. Evaluate alt quality, working paths, suitable captions, and clear page organization.
Student Report Card: student and term details; at least four subjects; caption; column and row headers with scope; data cells; a total or average row. Evaluate table semantics, header relationships, and consistent rows.
Travel Blog: destination article with sections and images; internal fragment link and external visitor resource; audio, video, or trusted map embed; informative title and fallback/explanatory text. Evaluate working internal/external navigation, relative image paths, appropriate alt text, and accessible media controls/title.
No finished assignment solution is included; students create their own code.

Each of the five topic quizzes has multiple-choice, predict-output, find-and-fix, and code challenge question types, with hints and explanations gated until submission. A score of 75% passes a topic. Students pass all five quizzes and self-check every assignment criterion to complete Milestone 2.`;

  milestones[2].content += `

TOPIC-BY-TOPIC LEARNING

1. Forms and action / method
A form groups controls for submission. action names the destination route and method tells the browser how to send the values. GET is useful for searches and filters that can be revisited; POST is common for creating or changing information. POST alone does not encrypt data. The receiving server must support the route and method.
Syntax: <form action="/contact" method="post">...<button type="submit">Send</button></form>
Expected behavior: the browser submits to the named route when the user activates a submit control; the server response depends on that route.
Common mistakes: a nonexistent action route, private values in a GET URL, or assuming POST alone is secure.
Practice: choose action and method for a shareable search and a new contact request.

2. Inputs and labels
input creates a control. type selects text, email, date, checkbox, and other field behavior. label provides a persistent accessible name. Match label for exactly to input id; id identifies the control and should be unique. Placeholder is not a label.
Syntax: <label for="email">Email</label><input id="email" name="email" type="email">
Expected behavior: clicking the connected label focuses the control.
Common mistakes: mismatched for/id values, duplicate ids, or placeholder used as the only label.
Practice: create associated name, email, and checkbox controls.

3. Buttons and input types
Choose input types that match the information. In a form, explicitly set button type: submit sends the form, reset restores initial values, and button does not submit by itself. Give each button clear text.
Syntax: <button type="submit">Send</button><button type="button">Check availability</button>
Expected behavior: submit activates the form; button does not submit it automatically.
Common mistakes: accidental submit behavior on a utility button, unsuitable input types, or an unexplained reset that clears entered work.
Practice: choose types for email, date, checkbox, and submit controls.

4. name, required, and autocomplete
name is the key for a submitted value; id instead identifies the control and connects its label. required asks browser validation to require a value before ordinary submission. autocomplete values such as name, email, and tel can help the browser offer saved information. These attributes do not replace labels.
Syntax: <input id="student-name" name="studentName" autocomplete="name" required>
Expected behavior: a blank required field blocks normal submission; the browser may offer a saved value.
Common mistakes: omitting name, making genuinely optional fields required, or treating placeholder as an instruction.
Practice: create a required email control with unique id, name, label, and autocomplete.

5. Semantic landmarks
header introduces a page or section, nav groups important navigation, main identifies central page content, section groups a headed topic, and footer provides closing or ownership information. Landmarks make page structure easier to navigate.
Syntax: <header>...</header><nav aria-label="Main navigation">...</nav><main><section><h2>Contact</h2>...</section></main><footer>...</footer>
Expected behavior: the page displays its content; assistive technology can identify meaningful regions.
Common mistakes: using section as a generic wrapper without a topic, placing central content outside main, or leaving multiple navigation regions indistinguishable.
Practice: outline a small page with all five landmarks and a heading in its section.

6. Accessible instructions and labels
Keep visible labels. Give short instructions near a field and connect additional help with aria-describedby pointing to an existing id. Explain which fields are required and use specific guidance. Do not use placeholder as the only label. Clear instructions help people understand expected input and correct mistakes.
Syntax: <label for="phone">Phone (required)</label><p id="phone-help">Include area code.</p><input id="phone" name="phone" type="tel" required aria-describedby="phone-help">
Expected behavior: visible label and instruction accompany the field; assistive technology can announce its associated description.
Common mistakes: placeholder-only names, vague error guidance, or an aria-describedby id that does not exist.
Practice: add a phone label, format instruction, and associated description.

PRACTICAL ASSIGNMENTS: REQUIREMENTS, EXPECTED BEHAVIOR, EVALUATION, HINTS
Student Registration Form: collect name, email, date of birth, and a student detail; use suitable types, matching labels/ids, unique names, required and autocomplete where appropriate, accessible instructions, and a named submit button. Expected: label clicks focus fields and blank required fields trigger browser validation. Evaluate action/method, labels, types, name/required/autocomplete use, instructions, and keyboard operation. Hint: keep unnecessary details optional. Submission check: test labels, required validation, unique ids, and keyboard-only navigation.
Contact Us Form: collect name, email, subject, and message; use labels, suitable email and multiline controls, names, required only where needed, and a suitable action/method. Expected: browser checks required values and email shape, then submits to the configured route. Evaluate all fields, accessible labels, chosen attributes, and clear endpoint expectations. Hint: use POST for a new message and ensure a server endpoint exists. Submission check: try empty fields and malformed email, verify button name and action route.
Semantic Webpage Layout: include header, nav, main, headed section, footer, and an accessible form. Expected: readers can identify page regions, keyboard users reach controls in order, and assistive technology can identify landmarks and field labels/instructions. Evaluate landmark structure, action/method, associated labels and instructions, and explicit button purposes. Hint: sketch page regions first. Submission check: keyboard-test controls, verify heading and landmark outline, and verify label/help id matches.
No finished assignment solutions are included.

Each topic has multiple-choice, predict-output, find-and-fix, and code questions at easy, medium, and challenging levels. Hints are optional. Show the correct option and explanation only after submission. Store each score and attempt. A score of 75% passes a topic; pass all six topic quizzes and complete rubric/submission checklists to finish Milestone 3.`;

  milestones[2].content = milestones[2].content
    .replace("Create a Student Registration Form with labeled fields, suitable types, and required values.", "Create a Student Registration Form with suitable input types, labels, name, required, autocomplete, and accessible instructions.")
    .replace("Create a Job Application Form with contact, role, experience, and optional resume fields.", "Create a Contact Us Form with name, email, subject, and message fields and a suitable action and method.")
    .replace("Create an FAQ page using details and summary for at least five questions.", "Create a Semantic Webpage Layout with header, nav, main, a headed section, footer, and an accessible form.");

  if (existing > 0) {
    for (const index of [0, 1, 2, 3]) {
      const lessonData = milestones[index];
      const legacyModules = index === 1
        ? [lessonData.module, "Milestone 2: Links, Images & Tables"]
        : index === 2
          ? [lessonData.module, "Milestone 3: Forms & Semantic HTML"]
          : [lessonData.module];
      const existingLesson = await Lesson.findOne({
        course: course._id,
        module: { $in: legacyModules },
      });
      if (existingLesson) {
        existingLesson.module = lessonData.module;
        existingLesson.title = lessonData.title;
        existingLesson.description = lessonData.description;
        existingLesson.content = lessonData.content;
        existingLesson.documentUrl = lessonData.documentUrl;
        existingLesson.resources = lessonData.resources;
        existingLesson.duration = lessonData.duration;
        existingLesson.published = true;
        await existingLesson.save();
      } else {
        await Lesson.create({
          course: course._id,
          ...lessonData,
          order: index + 1,
          published: true,
        });
      }
    }
    const project = milestones[4];
    await Lesson.findOneAndUpdate(
      { course: course._id, module: project.module },
      { $set: { ...project, published: true }, $setOnInsert: { course: course._id, order: 5 } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return;
  }

  await Lesson.create(milestones.map((lesson, index) => ({
    course: course._id,
    ...lesson,
    order: index + 1,
    published: true,
  })));
}

async function seedInitialCourses() {
  await seedHtmlFundamentals();
  const count = await Course.countDocuments();
  if (count > 0) return;

  console.log("Seeding initial WebVerse courses and lessons...");

  // 1. Web Explorers
  const explorers = await Course.create({
    title: "Web Explorers",
    description: "Discover how websites work and build your first webpage with HTML and web foundations.",
    classLevel: 8,
    subject: "Computer Science",
    category: "Web Development",
    thumbnail: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
    published: true,
  });

  await Lesson.create([
    {
      course: explorers._id,
      title: "Introduction to HTML",
      module: "Module 1: HTML Fundamentals",
      description: "Understand the building blocks of the web and write your very first HTML tags.",
      content: "HTML (HyperText Markup Language) is the standard markup language used to structure web pages. Every webpage on the internet uses HTML tags like <h1>, <p>, and <a> to structure text, images, and links.",
      videoUrl: "https://www.youtube.com/watch?v=kUMe1FH4CHE",
      documentUrl: "https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML",
      resources: [
        { title: "MDN HTML Reference", url: "https://developer.mozilla.org/en-US/docs/Web/HTML", type: "document" },
        { title: "W3Schools HTML Tutorial", url: "https://www.w3schools.com/html/", type: "link" },
      ],
      order: 1,
      duration: "15 min",
      published: true,
    },
    {
      course: explorers._id,
      title: "Headings and Paragraphs",
      module: "Module 1: HTML Fundamentals",
      description: "Organize webpage content hierarchically using headings from h1 to h6 and paragraphs.",
      content: "Headings structure your document from main titles (<h1>) to sub-subsections (<h6>). Paragraph tags (<p>) contain blocks of readable body copy.",
      videoUrl: "https://www.youtube.com/watch?v=MDLn5-zSQQI",
      documentUrl: "https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/HTML_text_fundamentals",
      resources: [
        { title: "HTML Text Fundamentals", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements", type: "document" },
      ],
      order: 2,
      duration: "15 min",
      published: true,
    },
    {
      course: explorers._id,
      title: "Links and Images",
      module: "Module 2: Multimedia & Navigation",
      description: "Connect pages together using anchor tags and embed engaging graphics with img tags.",
      content: "Hyperlinks with the <a> tag connect the web. Images with <img> bring web pages to life with visual demonstrations.",
      videoUrl: "https://www.youtube.com/watch?v=7X8g2-G13pU",
      documentUrl: "https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Images_in_HTML",
      resources: [
        { title: "Images in HTML", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img", type: "link" },
      ],
      order: 3,
      duration: "20 min",
      published: true,
    },
    {
      course: explorers._id,
      title: "Lists in HTML",
      module: "Module 2: Multimedia & Navigation",
      description: "Create ordered, unordered, and nested lists to present items clearly.",
      content: "Use <ul> for bulleted lists and <ol> for numbered sequences. Each entry is wrapped in an <li> item.",
      videoUrl: "https://www.youtube.com/watch?v=9gTwZx7w0AU",
      documentUrl: "https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/HTML_text_fundamentals#lists",
      resources: [
        { title: "MDN Lists Guide", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul", type: "link" },
      ],
      order: 4,
      duration: "15 min",
      published: true,
    },
  ]);

  // 2. Web Builders
  const builders = await Course.create({
    title: "Web Builders",
    description: "Learn CSS styling, responsive layout principles, and create modern visual web experiences.",
    classLevel: 10,
    subject: "Computer Science",
    category: "Frontend Development",
    thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    published: true,
  });

  await Lesson.create([
    {
      course: builders._id,
      title: "Introduction to CSS",
      module: "Module 1: CSS Basics",
      description: "Understand CSS selectors, rulesets, and how to attach styles to HTML elements.",
      content: "Cascading Style Sheets (CSS) describe how HTML elements are to be displayed on screen, paper, or in other media.",
      videoUrl: "https://www.youtube.com/watch?v=1PnVor36_40",
      documentUrl: "https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps/Getting_started",
      resources: [
        { title: "MDN CSS Basics", url: "https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps", type: "document" },
      ],
      order: 1,
      duration: "15 min",
      published: true,
    },
    {
      course: builders._id,
      title: "Colors and Typography",
      module: "Module 1: CSS Basics",
      description: "Choose harmonious color palettes and format beautiful web typography.",
      content: "Master color formats like HEX, RGB, HSL, and configure font families, weights, and letter spacing.",
      videoUrl: "https://www.youtube.com/watch?v=sOnqNZ_7YmE",
      documentUrl: "https://developer.mozilla.org/en-US/docs/Learn/CSS/Styling_text/Fundamentals",
      resources: [
        { title: "Coolors Palette Generator", url: "https://coolors.co", type: "link" },
      ],
      order: 2,
      duration: "20 min",
      published: true,
    },
    {
      course: builders._id,
      title: "CSS Flexbox Layouts",
      module: "Module 2: Layouts & Positioning",
      description: "Design flexible, responsive user interfaces with CSS Flexbox.",
      content: "Flexbox provides a more efficient way to lay out, align, and distribute space among items in a container, even when their size is unknown.",
      videoUrl: "https://www.youtube.com/watch?v=fYq5PXgSsbE",
      documentUrl: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/",
      resources: [
        { title: "A Complete Guide to Flexbox", url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/", type: "document" },
        { title: "Flexbox Froggy Game", url: "https://flexboxfroggy.com/", type: "link" },
      ],
      order: 3,
      duration: "25 min",
      published: true,
    },
  ]);

  // 3. Web Engineers
  const engineers = await Course.create({
    title: "Web Engineers",
    description: "Dive into JavaScript fundamentals, DOM manipulation, asynchronous programming, and web APIs.",
    classLevel: 12,
    subject: "Computer Science",
    category: "Full-Stack Engineering",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    published: true,
  });

  await Lesson.create([
    {
      course: engineers._id,
      title: "Introduction to JavaScript",
      module: "Module 1: JavaScript Essentials",
      description: "Discover what JavaScript can do and how it makes web applications interactive.",
      content: "JavaScript is a versatile programming language that powers dynamic interactions, event handling, and data fetching on modern web pages.",
      videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
      documentUrl: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/What_is_JavaScript",
      resources: [
        { title: "JavaScript First Steps", url: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps", type: "document" },
      ],
      order: 1,
      duration: "20 min",
      published: true,
    },
    {
      course: engineers._id,
      title: "Variables and Data Types",
      module: "Module 1: JavaScript Essentials",
      description: "Learn let, const, strings, numbers, booleans, objects, and arrays.",
      content: "Variables store data values. JavaScript supports primitive types like strings and numbers, as well as complex reference types like objects and arrays.",
      videoUrl: "https://www.youtube.com/watch?v=9M4XKi25I2M",
      documentUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures",
      resources: [
        { title: "JavaScript Data Types", url: "https://javascript.info/types", type: "document" },
      ],
      order: 2,
      duration: "25 min",
      published: true,
    },
    {
      course: engineers._id,
      title: "Functions and Logic",
      module: "Module 2: Logic & Architecture",
      description: "Structure reusable logic using arrow functions, conditionals, and return values.",
      content: "Functions are one of the fundamental building blocks in JavaScript. A function is a JavaScript procedure that executes a set of statements.",
      videoUrl: "https://www.youtube.com/watch?v=N8ap4k_1QEQ",
      documentUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions",
      resources: [
        { title: "MDN Functions Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions", type: "document" },
      ],
      order: 3,
      duration: "30 min",
      published: true,
    },
  ]);

  console.log("✅ Initial WebVerse courses and lessons seeded successfully!");
}

module.exports = seedInitialCourses;
