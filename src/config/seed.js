const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
const phaseOneCurriculum = require("./htmlPhaseOneCurriculum");
const cssPhaseTwoCurriculum = require("./cssPhaseTwoCurriculum");

async function seedCssPhaseTwo() {
  const title = "Phase 2: Dressing Up Your Websites with CSS";
  let course = await Course.findOne({ title });
  if (!course) {
    course = await Course.create({
      title,
      description: "Style the six-page Student Profile & Course Portal with CSS, then make every page work across desktop, tablet, and mobile screens.",
      classLevel: 8,
      subject: "Computer Science",
      category: "Web Development",
      thumbnail: "",
      published: true,
    });
  }

  const sectionTitles = ["CSS Fundamentals & Global Styling", "Typography, Colors & Navigation", "Profile Page & Box Model", "Courses Page — Flexbox", "Courses Page — CSS Grid", "Feedback Form Styling", "Grades Table Styling", "Contact Page Styling", "Responsive Web Design"];
  for (let index = 0; index < sectionTitles.length; index++) {
    const module = `Section ${index + 1}: ${sectionTitles[index]}`;
    const existing = await Lesson.findOne({ course: course._id, module });
    if (existing) continue;
    const curriculum = cssPhaseTwoCurriculum[index];
    const titles = curriculum.topics.map(item => item.tag);
    await Lesson.create({
      course: course._id,
      title: sectionTitles[index],
      module,
      description: `Learn ${titles.join(", ")}, practice in the CSS editor, complete the section quiz, and pass an independent styling assessment.`,
      content: `${module}\n\nLearn each concept in simple English, see a small example and its result, then try the editor tasks. Use the preview to inspect your CSS. Complete the quiz and the separate practical assessment to unlock the next section.\n\nCSS only: the HTML project is supplied as the page structure.`,
      curriculum,
      documentUrl: "https://developer.mozilla.org/en-US/docs/Learn/CSS",
      resources: [],
      order: index + 1,
      duration: "Learn, practice, and self-check",
      published: true,
    });
  }

  const finalModule = "Final Challenge: Responsive Six-Page Website";
  if (!await Lesson.findOne({ course: course._id, module: finalModule })) {
    await Lesson.create({
      course: course._id,
      title: "Final Challenge: Responsive Six-Page Website",
      module: finalModule,
      description: "Apply CSS independently to style the complete Home, Profile, Courses, Feedback, Grades, and Contact website responsively.",
      content: "Use the existing six-page HTML project as your structure. Create and share one external style.css across all pages. Style each page, then check desktop, tablet (768px), and mobile (480px) widths. Submit the final stylesheet after completing the nine sections.",
      curriculum: {
        language: "css",
        topics: [{ tag: "Six-page responsive challenge", what: "Bring the six existing HTML pages together with one reusable stylesheet.", why: "A shared stylesheet creates a consistent website and lets the layout adapt to all screens.", how: "Style home, profile, courses, feedback, grades, and contact pages; use the 768px and 480px breakpoints.", example: "/* Create shared colors, type, layout, and responsive rules */", output: "Six pages share a visual system and remain usable at desktop, tablet, and mobile widths.", mistakes: ["Check each page for missing styles.", "Test navigation and horizontal overflow at narrow widths."] }],
        tasks: [{ title: "Final website stylesheet", instructions: "Write an external stylesheet for the full six-page Student Profile & Course Portal. Style shared navigation and page regions, profile image and content, Flexbox or Grid course cards, feedback form, grades table, and contact details. At 768px stack navigation and adapt cards; at 480px tune font and spacing and keep the table horizontally scrollable. Use only CSS; the HTML pages are already provided.", starterCode: "/* Shared styles for Home, Profile, Courses, Feedback, Grades, and Contact */\n", validation: { requiredText: ["body", "nav", "@media", "768px", "480px", "grid", "flex", "table", "input"] } }],
        quiz: [{ type: "mcq", prompt: "Which file should the six HTML pages share?", options: ["style.css", "styles.js", "course.html", "layout.png"], answerIndex: 0, explanation: "A shared external style.css file can be linked from each HTML page." }, { type: "output", prompt: "What happens to this rule below 480px?", options: ["Main padding becomes 1rem", "Navigation disappears", "Table rows are removed", "Nothing can change"], answerIndex: 0, explanation: "The media query applies when viewport width is at most 480px.", snippet: "@media (max-width: 480px) { main { padding: 1rem; } }" }, { type: "error", prompt: "A page is wider than the phone screen because of a grades table. What is a useful fix?", options: ["Wrap it in an overflow-x:auto container", "Hide all columns", "Set every cell to 1px", "Remove the headings"], answerIndex: 0, explanation: "A wrapper can allow horizontal scrolling while preserving table information." }],
        assessment: { title: "Final six-page assessment", prompt: "Create a responsive shared stylesheet for the full six-page student website. Include the common site layout, page-specific profile, courses, feedback, grades, and contact styles, and responsive adjustments for 768px and 480px.", starterCode: "/* Write your final shared stylesheet */\n", validation: { requiredText: ["body", "header", "nav", "main", "footer", "profile", "course", "form", "table", "contact", "@media", "768px", "480px", "overflow-x"] }, testCases: ["The stylesheet covers all six page types.", "Navigation and cards adapt at 768px.", "Typography and spacing adapt at 480px.", "The grades table can scroll on a narrow screen."], criteria: ["A consistent shared visual system", "Styles for all six page structures", "Flexbox or Grid course layout", "Clear form, table, profile, and contact styling", "Responsive behavior at both required breakpoints"] },
      },
      documentUrl: "",
      resources: [],
      order: 10,
      duration: "Final project",
      published: true,
    });
  }
}

async function seedHtmlFundamentals() {
  const title = "Phase 1 — Student Profile & Course Portal (HTML Only)";
  let course = await Course.findOne({ title }) || await Course.findOne({ title: "HTML Fundamentals" });
  if (!course) course = await Course.create({ title, description: "", classLevel: 8, subject: "Computer Science", category: "Web Development", published: true });
  course.title = title;
  course.description = "Learn HTML structure, navigation, content, semantic organization, forms, and tables before building a six-page Student Profile & Course Portal. HTML only: no CSS or JavaScript.";
  course.published = true;
  await course.save();

  const titles = ["HTML Basics", "Navigation & Lists", "Headings & Images", "Semantic HTML", "Forms", "Tables"];
  const topics = [
    ["<!DOCTYPE html>", "<html>", "<head>", "<title>", "<body>", "<header>", "<main>", "<footer>", "<h1>"],
    ["<nav>", "<a> and href", "<ul>, <ol>, and <li>", "Relative file paths", "Linking multiple HTML pages"],
    ["<h1>, <h2>, and <h3>", "<p>", "<img>, src, and alt", "Relevant text formatting"],
    ["<header>", "<nav>", "<main>", "<footer>", "Headings and meaningful page sections"],
    ["<form>", "<label>", "<input> types text, email, radio, and checkbox", "<textarea>", "<select> and <option>", "<button type=submit>", "name and required"],
    ["<table>", "<caption>", "<thead>, <tbody>, and <tfoot>", "<tr>, <th>, and <td>"],
  ];
  const tasks = [
    ["Create a valid HTML document", "Add a page title, main heading, welcome paragraph, header, main, and footer", "Identify and correct errors in an incomplete document"],
    ["Create a navigation list and link two HTML pages", "Create ordered and unordered lists", "Fix broken links and relative paths, then plan navigation for a six-page website"],
    ["Create a student introduction with personal details and section headings", "Add a profile picture with appropriate alternative text", "Correct a missing image path and inappropriate heading structure"],
    ["Structure a page using semantic HTML and meaningful sections", "Identify inappropriate or unnecessary structural tags", "Create a consistent structure across multiple pages"],
    ["Create a form with a student's name and email", "Add radio buttons, checkboxes, a feedback textarea, and a dropdown", "Associate labels with controls and build a structured feedback form"],
    ["Create a grades table with course names, grades, and credits", "Add a caption and separate table head, body, and footer", "Identify and fix missing or incorrectly structured rows and cells"],
  ];
  const examples = [
    `<!DOCTYPE html>\n<html lang="en">\n<head><title>Student Portal</title></head>\n<body>\n  <header><h1>Welcome</h1></header>\n  <main><p>Start here.</p></main>\n  <footer>Student Portal</footer>\n</body>\n</html>`,
    `<nav><ul>\n  <li><a href="index.html">Home</a></li>\n  <li><a href="pages/profile.html">Profile</a></li>\n</ul></nav>\n<ol><li>First step</li><li>Next step</li></ol>\n<!-- From pages/profile.html, link back with ../index.html -->`,
    `<h1>About Me</h1>\n<h2>Personal details</h2>\n<p>I enjoy learning and helping my community.</p>\n<h2>Hobbies</h2>\n<img src="images/profile.jpg" alt="A student smiling outdoors">`,
    `<header><h1>Student Portal</h1></header>\n<nav aria-label="Main navigation"><a href="index.html">Home</a></nav>\n<main><section><h2>Announcements</h2><p>Welcome.</p></section></main>\n<footer>Student Portal information</footer>`,
    `<form action="#" method="post">\n  <label for="name">Name</label><input id="name" name="name" type="text" required>\n  <label for="email">Email</label><input id="email" name="email" type="email" required>\n  <label><input type="radio" name="kind" value="course"> Course</label>\n  <label><input type="checkbox" name="followUp" value="yes"> Contact me</label>\n  <label for="message">Message</label><textarea id="message" name="message"></textarea>\n  <label for="rating">Rating</label><select id="rating" name="rating"><option>Good</option></select>\n  <button type="submit">Send feedback</button>\n</form>`,
    `<table>\n  <caption>Term grades and credits</caption>\n  <thead><tr><th>Course</th><th>Grade</th><th>Credits</th></tr></thead>\n  <tbody><tr><td>HTML</td><td>A</td><td>3</td></tr></tbody>\n  <tfoot><tr><th>Total credits</th><td colspan="2">3</td></tr></tfoot>\n</table>`,
  ];
  const exploration = [
    "DOCTYPE tells the browser to use modern HTML. html is the root element. head contains metadata, title names the browser tab, and body contains visible content. header, main, and footer identify the page introduction, central content, and closing region. h1 is the main page heading.",
    "nav groups important navigation. a creates a link and href gives its destination. ul is a collection; ol is a sequence; li is each entry. A relative href is resolved from the current file: pages/profile.html enters a child folder, while ../index.html moves to the parent first.",
    "h1 names the page topic; h2 and h3 introduce nested sections. p contains prose. img displays a file named by src. alt gives a useful text alternative when the image is unavailable or cannot be seen. Use strong for importance and em for emphasis when those meanings fit.",
    "header introduces a page or section. nav marks important navigation. main contains the page's central unique content. section groups a related topic and should have a heading. footer holds closing or ownership information. Choose elements for meaning and keep a clear heading outline.",
    "form groups related controls. label describes a field; matching for and id values associate them. input type text accepts a short value; email checks email-shaped input; radio chooses one option in a named group; checkbox toggles an option. textarea accepts longer text. select contains option choices. name identifies a submitted value and required asks for a value. This practice form does not store or send submissions without a configured service.",
    "table is for data arranged in rows and columns. caption describes the table. thead groups the column headings, tbody groups the data, and tfoot groups a summary. tr is one row; th identifies a heading; td contains a value. Keep each cell inside a row and rows inside the relevant table section.",
  ];
  const projectPages = [
    { name: "Home", time: "90 minutes", requirements: "Valid document structure; header and h1 website title; nav with ul, li, and a; main welcome; footer copyright." },
    { name: "Profile", time: "75 minutes", requirements: "My Profile heading; profile img; headings for personal details, hobbies, and goals; biography paragraphs; list of hobbies, skills, or goals; navigation." },
    { name: "Courses", time: "75 minutes", requirements: "My Courses heading; course names as headings; course descriptions; course or module lists; navigation; optional course detail links." },
    { name: "Feedback", time: "90 minutes", requirements: "Submit Feedback heading; labeled form; text and email inputs; radio buttons and checkboxes; textarea; select and option; submit button; navigation." },
    { name: "Grades Table", time: "60 minutes", requirements: "My Grades heading; caption, thead, tbody, tfoot, tr, th, and td; columns for course name, grade, and credits; navigation." },
    { name: "Contact Us", time: "No additional time specified", requirements: "Dummy contact details; mailto email links; address or contact paragraph; headings for contact methods; navigation." },
  ];
  const projectChecklist = [
    { id: "structure", label: "All six required HTML pages exist" },
    { id: "about", label: "Navigation works between the pages" },
    { id: "navigation", label: "Each page contains its required HTML elements" },
    { id: "projects", label: "Images include appropriate alt attributes" },
    { id: "education", label: "Links and relative paths work" },
    { id: "multimedia", label: "Feedback form has required fields and associated labels" },
    { id: "contact", label: "Grades table uses the required structural tags" },
    { id: "readme-assets", label: "Semantic HTML is used appropriately" },
    { id: "html-only", label: "No CSS or JavaScript has been used" },
    { id: "browser-review", label: "All pages have been tested in a browser" },
  ];
  const lessons = titles.map((title, i) => ({
    module: `Section ${i + 1}: ${title}`, title, order: i + 1, duration: "Learn, practice, and self-check", published: true,
    description: `Learn ${topics[i].join(", ")} first, then complete the related practice tasks.`,
    curriculum: phaseOneCurriculum[i],
    documentUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML", resources: [],
    content: `GOLDEN RULE: Students may use only HTML for this phase. Do not use CSS, JavaScript, frameworks, or backend development.\n\nLEARN\n${topics[i].map(t => `${t}: Learn what it means, why it is used, and when it belongs in a page.`).join("\n")}\n\nUNDERSTAND — SYNTAX AND SMALL EXAMPLE\n${examples[i]}\n\nEXPLORE — WHAT THE TAGS AND ATTRIBUTES DO\n${exploration[i]}\n\nPRACTICE — COMPLETE AFTER LEARNING\n${tasks[i].map((t,n)=>`${n+1}. ${t}`).join("\n")}\n\nTEST\nCheck every required element and attribute, inspect tag nesting, and open links or images. In debugging tasks, find the first incorrect tag, path, or parent-child relationship and explain the fix.\n\nFEEDBACK\nCorrect work uses each tag for its meaning, keeps elements properly nested, and meets the task requirements. Improve missing attributes, unclear labels, broken paths, or headings chosen only for appearance. Use a hint, correct the issue, and review again.\n\nCONTINUE\nComplete the learning and related task before moving to the next section. The final project appears after all six learning sections.\n\nHINTS\nStart with a small outline. Check opening and closing tags. Resolve paths from the current file. Match each label to its control. Use table headers to explain the data.`
  }));
  lessons.push({
    module: "Final Project: Student Profile & Course Portal", title: "Final Project: Student Profile & Course Portal", order: 7, duration: "Project", published: true,
    description: "Build and submit six connected pages using only HTML after completing Sections 1–6.", documentUrl: "", resources: [],
    curriculum: { projectPages, submissionChecklist: projectChecklist, evaluationCriteria: ["Six required pages and valid document structures", "Working navigation and relative paths", "Page-specific content requirements", "Accessible form labels and inputs", "Correct table structure", "Semantic HTML and alt text", "HTML-only source and browser review"] },
    content: `# Student Profile & Course Portal — HTML Only\n\nStart after learning the relevant concepts and completing their tasks. Build each page independently; no complete project solution is provided. Use HTML only, without CSS or JavaScript.\n\n${projectPages.map((p,i)=>`${i+1}. ${p.name}: ${p.requirements} Maximum time: ${p.time}.`).join("\n")}\n\nSUBMISSION CHECKLIST\n${projectChecklist.map(item=>`[ ] ${item.label}`).join("\n")}\n\nFEEDBACK AND RESUBMISSION\nReview missing requirements and incorrect HTML structure, correct them, and submit again.\n\nThe feedback form is for practicing HTML structure only. Without a configured backend or form-processing service, it will not store or deliver submissions. Use dummy contact details on Contact Us.`
  });

  // Reuse existing lesson documents so student progress references and enrollment stay valid.
  const old = await Lesson.find({ course: course._id }).sort({ order: 1, createdAt: 1 });
  const project = old.find(l => /^Final Project: (Personal Portfolio Website|Student Profile & Course Portal)$/.test(l.module || ""));
  const reusable = old.filter(l => !project || String(l._id) !== String(project._id));
  const selected = lessons.map((_, index) => index === 6 && project ? project : (reusable[index] || new Lesson({ course: course._id })));
  const needsUpdate = (doc, index) => !((doc.curriculum && index < 6) || (index === 6 && doc.module === lessons[6].module && doc.curriculum));

  // Some deployments have a unique course/order index. Move documents that
  // need migration out of the target range first, so interrupted retries do
  // not collide with the old final-project row while new sections are created.
  const maxOrder = old.reduce((max, lesson) => Math.max(max, lesson.order || 0), 0);
  const migrating = selected.filter((doc, index) => !doc.isNew && needsUpdate(doc, index));
  for (const [index, doc] of migrating.entries()) {
    doc.order = maxOrder + 1000 + index;
    await doc.save();
  }

  const keep = [];
  for (let i = 0; i < lessons.length; i++) {
    const doc = selected[i];
    if (!needsUpdate(doc, i)) {
      keep.push(doc._id);
      continue; // Preserve admin edits, lesson order, and saved progress on restart.
    }
    Object.assign(doc, lessons[i], { course: course._id });
    await doc.save();
    keep.push(doc._id);
  }
  await Lesson.updateMany({
    course: course._id,
    _id: { $nin: keep },
    module: { $in: [
      "Milestone 1: HTML Fundamentals",
      "Milestone 2: Links, Images, Tables & Multimedia",
      "Milestone 2: Links, Images & Tables",
      "Milestone 3: HTML Forms, Semantics & Accessibility",
      "Milestone 3: Forms & Semantic HTML",
      "Milestone 4: Layout & Final Project",
      "Final Project: Personal Portfolio Website",
    ] },
  }, { $set: { published: false } });
}

async function seedInitialCourses() {
  await seedHtmlFundamentals();
  await seedCssPhaseTwo();
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
