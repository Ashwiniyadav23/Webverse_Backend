const has = (text, pattern) => pattern.test(text);
const count = (text, pattern) => [...text.matchAll(pattern)].length;
const category = (name, maxMarks, checks) => {
  const passed = checks.filter(check => check.passed);
  const missing = checks.filter(check => !check.passed);
  return {
    name,
    maxMarks,
    marks: Math.round(maxMarks * passed.length / Math.max(checks.length, 1)),
    completedRequirements: passed.map(check => check.label),
    missingRequirements: missing.map(check => check.label),
    suggestions: missing.map(check => check.hint),
    errors: [],
  };
};

function checkHtmlNesting(html) {
  const stack = [];
  const voidTags = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
  const tokens = html.replace(/<!--[\s\S]*?-->/g, "").match(/<\/?[a-z][\w-]*\b[^>]*>/gi) || [];
  for (const token of tokens) {
    const closing = /^<\//.test(token);
    const name = token.match(/^<\/?([a-z][\w-]*)/i)?.[1]?.toLowerCase();
    if (!name || voidTags.has(name) || /\/>$/.test(token)) continue;
    if (!closing) stack.push(name);
    else if (stack.pop() !== name) return false;
  }
  return stack.length === 0;
}

function findSection(html, id) {
  const match = html.match(new RegExp(`<section\\b[^>]*\\bid\\s*=\\s*["']${id}["'][^>]*>([\\s\\S]*?)<\\/section\\s*>`, "i"));
  return match?.[1] || "";
}

function evaluateCombinedPortfolio(htmlCode, cssCode) {
  const html = htmlCode.toLowerCase();
  const css = cssCode.toLowerCase();
  const sections = ["home", "about", "skills", "projects", "education", "contact"].map(id => findSection(htmlCode, id).toLowerCase());
  const navMarkup = [...htmlCode.matchAll(/<nav\b[^>]*>([\s\S]*?)<\/nav\s*>/gi)].map(match => match[1]).join("\n");
  const navTargets = [...navMarkup.matchAll(/<a\b[^>]*\bhref\s*=\s*["']#([^"']+)["']/gi)].map(match => match[1].toLowerCase());
  const projectSection = sections[3];
  const validProjectEntries = Math.min(count(projectSection, /<h[2-6]\b[^>]*>[^<]+<\/h[2-6]>/gi), count(projectSection, /<p\b[^>]*>[^<]+<\/p>/gi));
  const projectLinks = [...projectSection.matchAll(/<a\b[^>]*\bhref\s*=\s*["']([^"']+)["']/gi)].filter(match => !/^#?$/.test(match[1].trim())).length;
  const skillsSection = sections[2];
  const skillsItems = count(skillsSection, /<li\b/gi);
  const images = [...sections[1].matchAll(/<img\b[^>]*>/gi)].map(match => match[0]);
  const aboutImage = images.some(image => /\balt\s*=\s*["'][^"']+?["']/i.test(image) && /\bsrc\s*=/i.test(image));
  const stylesheetLinked = /<link\b(?=[^>]*\brel\s*=\s*["']stylesheet["'])(?=[^>]*\bhref\s*=\s*["'][^"']*style\.css[^"']*["'])[^>]*>/i.test(htmlCode);
  const noInlineStyle = htmlCode.trim().length > 0 && cssCode.trim().length > 0 && !/<style\b|\sstyle\s*=/i.test(htmlCode);
  const noScript = htmlCode.trim().length > 0 && cssCode.trim().length > 0 && !/<\s*script\b|\bon[a-z]+\s*=|javascript\s*:/i.test(htmlCode + cssCode);
  const noFrameworks = htmlCode.trim().length > 0 && cssCode.trim().length > 0 && !/bootstrap|tailwind/i.test(cssCode) && !/<link\b[^>]*\bhref\s*=\s*["'][^"']*(?:bootstrap|tailwind|react)[^"']*["']/i.test(htmlCode);
  const nestingOkay = htmlCode.trim().length > 0 && checkHtmlNesting(htmlCode);
  const cssOpenBraces = (cssCode.match(/{/g) || []).length;
  const balancedCss = cssCode.trim().length > 0 && cssOpenBraces > 0 && cssOpenBraces === (cssCode.match(/}/g) || []).length;
  const cssWithoutComments = cssCode.replace(/\/\*[\s\S]*?\*\//g, "");
  const cssDeclarationsOkay = balancedCss && /\{[^{}]*\b[a-z-]+\s*:\s*[^;{}]+;/i.test(cssWithoutComments) && !/\{[^{}]*\b[a-z-]+\s+[^:;{}]+;/i.test(cssWithoutComments);
  const selectors = [...htmlCode.matchAll(/\bclass\s*=\s*["']([^"']+)["']/gi)].flatMap(match => match[1].split(/\s+/).filter(Boolean)).map(name => `.${name.toLowerCase()}`)
    .concat([...htmlCode.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map(match => `#${match[1].toLowerCase()}`));
  const sharedSelectors = selectors.filter((selector, index) => selectors.indexOf(selector) === index && css.includes(selector)).length;
  const sectionContent = sections.map(section => /<h[1-6]\b[^>]*>[^<]+<\/h[1-6]>/i.test(section) && /<(p|ul|ol|article)\b/i.test(section));

  const categories = [
    category("Document structure and semantic HTML", 10, [
      { label: "HTML5 doctype is present", passed: /<!doctype\s+html\s*>/i.test(htmlCode), hint: "Start the document with <!DOCTYPE html>." },
      { label: "HTML element declares its language", passed: /<html\b[^>]*\blang\s*=\s*["'][a-z-]+["']/i.test(htmlCode), hint: "Set a language, for example lang=\"en\", on html." },
      { label: "Head contains a page title", passed: /<head\b[\s\S]*?<title\b[^>]*>\s*[^<]+<\/title>[\s\S]*?<\/head>/i.test(htmlCode), hint: "Add a descriptive title inside head." },
      { label: "Body contains semantic header, navigation, main, and footer", passed: /<body\b[\s\S]*?<header\b[\s\S]*?<nav\b[\s\S]*?<main\b[\s\S]*?<footer\b[\s\S]*?<\/body>/i.test(htmlCode), hint: "Organize the page with header, nav, main, and footer elements." },
      { label: "HTML tags are properly nested", passed: nestingOkay, hint: "Check opening and closing tags and keep child elements inside their parent." },
    ]),
    category("Required portfolio sections and content", 15, [
      ...["Home", "About Me", "Skills", "Projects", "Education", "Contact"].map((name, index) => ({ label: `${name} section has a heading and content`, passed: Boolean(sectionContent[index]), hint: `Give the ${name} section a heading and relevant content.` })),
      { label: "Skills section lists at least five skills", passed: skillsItems >= 5, hint: "List at least five technical or personal skills in the Skills section." },
      { label: "Projects section has two entries with a title and description each", passed: validProjectEntries >= 2, hint: "Add at least two project entries, each with its own heading and description paragraph." },
      { label: "Projects section provides at least two relevant links", passed: projectLinks >= 2, hint: "Add a relevant link for each of at least two projects." },
      { label: "Home introduces the student and welcomes visitors", passed: /<h1\b[^>]*>[^<]+<\/h1>/i.test(sections[0]) && /<p\b[^>]*>[^<]+<\/p>/i.test(sections[0]) && /welcome/i.test(sections[0]), hint: "Include your name as the Home heading, a short introduction, and a welcome message." },
      { label: "About section describes personal learning goals", passed: /goal/i.test(sections[1]), hint: "Include your learning goals in About Me." },
    ]),
    category("Navigation, images, and links", 10, [
      { label: "Navigation links point to all six portfolio sections", passed: ["home", "about", "skills", "projects", "education", "contact"].every(id => navTargets.includes(id)), hint: "Add navigation links to #home, #about, #skills, #projects, #education, and #contact." },
      { label: "About section includes an image with meaningful alt text", passed: aboutImage, hint: "Add a profile image in About Me with a useful src and non-empty alt description." },
      { label: "Contact section includes an email link", passed: /mailto:[^"']+/.test(sections[5]), hint: "Add an email link that uses a mailto: destination." },
      { label: "Home navigation can return to the Home section", passed: navTargets.filter(target => target === "home").length > 0, hint: "Include a Home link with href=\"#home\"." },
    ]),
    category("Typography, colors, and visual design", 10, [
      { label: "A readable font family is defined", passed: /font-family\s*:/i.test(cssCode), hint: "Choose a readable font-family for the page." },
      { label: "Text and background colors are styled", passed: /(?:^|[;{}])\s*color\s*:/i.test(cssCode) && /background(?:-color)?\s*:/i.test(cssCode), hint: "Set text color and at least one page or section background color." },
      { label: "Headings and body text have deliberate type styling", passed: /(?:h1|h2|h3|p|body)[^{]*\{[^}]*font-size\s*:/i.test(cssCode) || /line-height\s*:/i.test(cssCode), hint: "Set a clear type scale or line-height for readable content." },
    ]),
    category("Box model and spacing", 10, [
      { label: "Margins create consistent outer spacing", passed: /margin(?:-[a-z]+)?\s*:/i.test(cssCode), hint: "Use margin to create space around page sections and cards." },
      { label: "Padding creates inner space", passed: /padding(?:-[a-z]+)?\s*:/i.test(cssCode), hint: "Use padding to give navigation, sections, and cards breathing room." },
      { label: "Borders or outlines define visual boundaries", passed: /\b(?:border|outline)(?:-[a-z]+)?\s*:/i.test(cssCode), hint: "Use a border or outline to define an element boundary." },
    ]),
    category("Flexbox or Grid layout", 10, [
      { label: "Skills or project content uses Flexbox or Grid", passed: /display\s*:\s*(?:flex|grid)\b/i.test(cssCode), hint: "Use display:flex or display:grid to arrange skill or project items." },
      { label: "Layout defines useful spacing or track distribution", passed: /\b(?:gap|grid-template-columns|justify-content|flex-wrap)\s*:/i.test(cssCode), hint: "Add gap, grid tracks, wrapping, or distribution to organize the cards." },
    ]),
    category("Hover effects and styling details", 5, [
      { label: "Links or buttons have a hover state", passed: /(?:a|button|\.\w+)\s*:[\s\n]*hover\b/i.test(cssCode), hint: "Add a visible :hover rule to links or buttons." },
    ]),
    category("Mobile responsiveness", 10, [
      { label: "A mobile media query is present", passed: /@media\s*\([^)]*(?:max-width|min-width)\s*:/i.test(cssCode), hint: "Add a media query for a narrow viewport, such as @media (max-width: 480px)." },
      { label: "Mobile rules adjust layout or spacing", passed: /@media\s*\([^)]*(?:max-width|min-width)\s*:[^)]*\)\s*\{[\s\S]*?(?:flex-direction|grid-template-columns|padding|font-size|width)\s*:/i.test(cssCode), hint: "Inside the media query, adjust the layout, type size, width, or spacing." },
      { label: "Stylesheet has balanced rule braces", passed: balancedCss, hint: "Match every opening CSS brace with a closing brace." },
      { label: "CSS declarations use property/value syntax", passed: cssDeclarationsOkay, hint: "Write declarations as property: value; inside each rule." },
    ]),
    category("Readable and organized code", 5, [
      { label: "HTML is formatted across readable lines", passed: htmlCode.split("\n").length >= 12, hint: "Put document regions and content on separate, indented lines." },
      { label: "CSS is formatted across readable lines", passed: cssCode.split("\n").length >= 6, hint: "Format CSS rules and declarations on readable lines." },
      { label: "HTML and CSS avoid inline styling and scripts", passed: noInlineStyle && noScript, hint: "Keep styling in style.css and use HTML and CSS only; remove inline styles and scripts." },
    ]),
    category("Consistent design across sections", 5, [
      { label: "Shared colors or spacing are defined for reuse", passed: /--[a-z][\w-]*\s*:/i.test(cssCode), hint: "Consider defining reusable color or spacing variables in :root." },
      { label: "Shared typography or spacing styles apply across the page", passed: /(?:body|main|section|h1|p)\s*\{/i.test(cssCode), hint: "Apply a few consistent base styles to the whole page and sections." },
    ]),
    category("HTML and CSS work together", 5, [
      { label: "HTML connects the external style.css file", passed: stylesheetLinked, hint: "Link style.css from head with rel=\"stylesheet\"." },
      { label: "CSS selectors match classes or IDs in the HTML", passed: sharedSelectors >= 3, hint: "Check class and ID names in your HTML and target them with matching CSS selectors." },
    ]),
    category("Requirements completed independently", 5, [
      { label: "All six required sections are present", passed: sections.every(Boolean), hint: "Finish Home, About Me, Skills, Projects, Education, and Contact." },
      { label: "Required HTML and CSS contain no JavaScript", passed: noScript, hint: "Remove script tags, event attributes, and JavaScript URLs." },
      { label: "Portfolio uses plain HTML and CSS without frameworks", passed: noFrameworks, hint: "Remove Bootstrap, Tailwind, React, and other framework references; write the styles yourself." },
      { label: "Submitted files contain code", passed: htmlCode.trim().length > 0 && cssCode.trim().length > 0, hint: "Write both the HTML document and the external CSS stylesheet." },
    ]),
  ];

  const htmlScore = categories.slice(0, 3).reduce((sum, item) => sum + item.marks, 0);
  const cssScore = categories.slice(3, 8).reduce((sum, item) => sum + item.marks, 0);
  const qualityScore = categories.slice(8).reduce((sum, item) => sum + item.marks, 0);
  const score = htmlScore + cssScore + qualityScore;
  const completeSections = sections.filter(Boolean).length;
  const passed = score >= 70 && completeSections === 6 && stylesheetLinked && balancedCss && noScript && noFrameworks;
  const completedRequirements = categories.flatMap(item => item.completedRequirements.map(requirement => `${item.name}: ${requirement}`));
  const missingRequirements = categories.flatMap(item => item.missingRequirements.map(requirement => `${item.name}: ${requirement}`));
  return {
    score,
    htmlScore,
    cssScore,
    qualityScore,
    passed,
    status: passed ? "complete" : "needs_revision",
    categories,
    completedRequirements,
    missingRequirements,
    errors: [
      ...(!nestingOkay ? ["Some HTML tags do not appear to be properly nested."] : []),
      ...(!balancedCss ? ["The CSS rule braces are unbalanced."] : []),
      ...(!noScript ? ["Remove JavaScript; this assessment accepts HTML and CSS only."] : []),
      ...(!noFrameworks ? ["Remove framework references; this assessment accepts plain HTML and CSS only."] : []),
    ],
    suggestions: categories.flatMap(item => item.suggestions),
  };
}

module.exports = { evaluateCombinedPortfolio };
