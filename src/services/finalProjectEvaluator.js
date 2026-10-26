const rubric = [
  { name: "Six pages and valid HTML structure", maxMarks: 20 },
  { name: "Navigation and relative links", maxMarks: 15 },
  { name: "Home, Profile, Courses, and Contact content", maxMarks: 20 },
  { name: "Feedback form structure", maxMarks: 15 },
  { name: "Grades table structure", maxMarks: 15 },
  { name: "Semantic HTML, images, and HTML-only submission", maxMarks: 15 },
];
const requiredPages = ["index.html", "profile.html", "courses.html", "feedback.html", "grades.html", "contact.html"];
const has = (text, regex) => regex.test(text);
function evaluatePortal(files) {
  const htmlFiles = files.filter(file => /\.html?$/i.test(file.path));
  const byName = new Map(htmlFiles.map(file => [file.path.split("/").pop().toLowerCase(), file]));
  const allHtml = htmlFiles.map(file => file.content).join("\n");
  const paths = new Set(files.map(file => file.path.toLowerCase()));
  const categories = rubric.map(({ name, maxMarks }) => ({ name, marks: 0, maxMarks, completedRequirements: [], missingRequirements: [], errors: [], suggestions: [] }));
  const add = (categoryIndex, ok, label, suggestion, error) => {
    const category = categories[categoryIndex];
    (ok ? category.completedRequirements : category.missingRequirements).push(label);
    if (!ok) { category.suggestions.push(suggestion); if (error) category.errors.push(error); }
  };
  const allPagesPresent = requiredPages.every(name => byName.has(name));
  add(0, allPagesPresent, "All six required page files are present", `Include: ${requiredPages.join(", ")}.`, `Missing page(s): ${requiredPages.filter(name => !byName.has(name)).join(", ") || "none"}`);
  add(0, htmlFiles.length > 0 && htmlFiles.every(file => /<!doctype\s+html\s*>/i.test(file.content)), "Every HTML page includes a doctype", "Start each page with <!DOCTYPE html>.");
  add(0, htmlFiles.length > 0 && htmlFiles.every(file => /<html\b[^>]*\blang\s*=\s*["'][^"']+["']/i.test(file.content) && /<head\b[\s\S]*?<title\b[^>]*>\s*[^<]+<\/title>[\s\S]*?<\/head>/i.test(file.content)), "Every page declares its language and a title", "Add a language on html and a descriptive title in head on every page.");
  for (const [file, heading] of [["index.html", /<h1\b/i], ["profile.html", /<h1\b[^>]*>\s*My Profile/i], ["courses.html", /<h1\b[^>]*>\s*My Courses/i], ["feedback.html", /<h1\b[^>]*>\s*Submit Feedback/i], ["grades.html", /<h1\b[^>]*>\s*My Grades/i], ["contact.html", /<h1\b[^>]*>\s*Contact Us/i]]) {
    add(0, Boolean(byName.get(file) && has(byName.get(file).content, heading)), `${file} has its required page heading`, `Add the specified heading to ${file}.`);
  }
  const navCount = htmlFiles.filter(file => /<nav\b[\s\S]*?<\/nav>/i.test(file.content)).length;
  add(1, allPagesPresent && navCount === 6, "Each page includes site navigation", "Add a nav region to all six pages.");
  const expectedTargets = requiredPages.map(name => name.replace(/\.html$/, ""));
  const linkedTargets = [...allHtml.matchAll(/<a\b[^>]*href\s*=\s*["']([^"']+)["']/gi)].map(m => m[1].split("/").pop().replace(/\.html(?:#.*)?$/i, "").toLowerCase());
  add(1, expectedTargets.every(target => linkedTargets.includes(target)), "Navigation links connect the six pages", "Link to index.html, profile.html, courses.html, feedback.html, grades.html, and contact.html.");
  const refs = htmlFiles.flatMap(file => [...file.content.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/gi)].map(m => ({ source: file.path, ref: m[1] })));
  const missingRefs = refs.filter(({ source, ref }) => !/^(https?:|mailto:|tel:|#|data:|\/\/)/i.test(ref) && !ref.startsWith("/") && !paths.has(require("path").posix.normalize(require("path").posix.join(require("path").posix.dirname(source), ref.split("#")[0])).toLowerCase()));
  add(1, refs.length > 0 && missingRefs.length === 0, "Referenced local links and images resolve", "Check each relative path from the HTML file that uses it.", missingRefs.length ? `Unmatched local reference(s): ${missingRefs.map(item => `${item.source}: ${item.ref}`).join(", ")}` : undefined);
  const home = byName.get("index.html")?.content || "";
  add(2, /<header\b/i.test(home) && /<h1\b/i.test(home) && /<main\b[\s\S]*?<\/main>/i.test(home) && /<footer\b/i.test(home) && /welcome/i.test(home), "Home has title, welcome, header, main, and footer", "Add the website title, welcome message, and required semantic regions to Home.");
  add(2, /<nav\b[\s\S]*?<ul\b[\s\S]*?<li\b[\s\S]*?<a\b/i.test(home), "Home navigation uses nav, ul, li, and links", "Build the Home navigation as a list of links inside nav.");
  const profile = byName.get("profile.html")?.content || "";
  add(2, /<img\b/i.test(profile) && /personal details/i.test(profile) && /hobbies/i.test(profile) && /goals/i.test(profile) && /<p\b/i.test(profile) && /<(ul|ol)\b/i.test(profile), "Profile has picture, personal sections, biography, and a list", "Add the required student profile content and image.");
  const courses = byName.get("courses.html")?.content || "";
  add(2, /<h[1-6]\b[^>]*>\s*My Courses/i.test(courses) && /<p\b/i.test(courses) && /<(ul|ol)\b/i.test(courses), "Courses page has course descriptions and a list", "Add course headings, descriptions, and a course or module list.");
  const contact = byName.get("contact.html")?.content || "";
  add(2, /mailto:/i.test(contact) && /<address\b|\b(address|contact)\b/i.test(contact), "Contact page has dummy contact details and email links", "Add dummy contact information and a mailto link.");
  const feedback = byName.get("feedback.html")?.content || "";
  add(3, /<form\b/i.test(feedback) && /type\s*=\s*["']text["']/i.test(feedback) && /type\s*=\s*["']email["']/i.test(feedback) && /<textarea\b/i.test(feedback) && /<select\b[\s\S]*?<option\b/i.test(feedback) && /<button\b[^>]*type\s*=\s*["']submit["']/i.test(feedback), "Feedback form includes text/email, message, dropdown, and submit", "Include every requested feedback form control.");
  add(3, /type\s*=\s*["']radio["']/i.test(feedback) && /type\s*=\s*["']checkbox["']/i.test(feedback), "Feedback form includes radio buttons and checkboxes", "Add at least one radio and checkbox control.");
  const controls = [...feedback.matchAll(/<(input|textarea|select)\b[^>]*>/gi)].map(m => m[0]);
  const labelIds = new Set([...feedback.matchAll(/<label\b[^>]*\bfor\s*=\s*["']([^"']+)["']/gi)].map(m => m[1]));
  const unlabelled = controls.filter(tag => { const id = tag.match(/\bid\s*=\s*["']([^"']+)["']/i)?.[1]; return !id || !labelIds.has(id); });
  add(3, controls.length > 0 && unlabelled.length === 0, "Feedback controls have associated labels", "Match each label for attribute to a unique control id.", unlabelled.length ? `${unlabelled.length} control(s) lack a matching label.` : undefined);
  add(3, /\bname\s*=/i.test(feedback) && /\brequired\b/i.test(feedback), "Form demonstrates name and required attributes", "Use meaningful name values and required where the field must be completed.");
  const grades = byName.get("grades.html")?.content || "";
  add(4, /<table\b/i.test(grades) && /<caption\b/i.test(grades) && /<thead\b[\s\S]*?<\/thead>/i.test(grades) && /<tbody\b[\s\S]*?<\/tbody>/i.test(grades) && /<tfoot\b[\s\S]*?<\/tfoot>/i.test(grades), "Grades table uses caption, thead, tbody, and tfoot", "Add all requested table sections and a descriptive caption.");
  add(4, /<tr\b/i.test(grades) && /<th\b/i.test(grades) && /<td\b/i.test(grades) && /course/i.test(grades) && /grade/i.test(grades) && /credit/i.test(grades), "Grades table includes course, grade, and credits columns", "Use table rows, headers, and data cells for all three columns.");
  add(5, /<header\b/i.test(allHtml) && /<nav\b/i.test(allHtml) && /<main\b/i.test(allHtml) && /<footer\b/i.test(allHtml), "Semantic landmarks are used", "Use header, nav, main, and footer in appropriate regions.");
  const images = [...allHtml.matchAll(/<img\b[^>]*>/gi)].map(m => m[0]);
  const missingAlt = images.filter(image => !/\balt\s*=\s*["'][^"']*["']/i.test(image));
  add(5, images.length > 0 && missingAlt.length === 0, "Images have alt attributes", "Give each image appropriate alternative text.", missingAlt.length ? `${missingAlt.length} image(s) are missing alt.` : undefined);
  const forbidden = htmlFiles.filter(file => /<\s*script\b|<\s*style\b|\sstyle\s*=|javascript\s*:/i.test(file.content));
  add(5, forbidden.length === 0, "Submitted pages use HTML only", "Remove CSS and JavaScript from the submitted pages.", forbidden.length ? `CSS or JavaScript found in: ${forbidden.map(file => file.path).join(", ")}` : undefined);
  for (const category of categories) {
    const total = category.completedRequirements.length + category.missingRequirements.length;
    category.marks = total ? Math.round(category.maxMarks * category.completedRequirements.length / total) : 0;
  }
  const score = categories.reduce((sum, category) => sum + category.marks, 0);
  const completedRequirements = categories.flatMap(category => category.completedRequirements.map(item => `${category.name}: ${item}`));
  const missingRequirements = categories.flatMap(category => category.missingRequirements.map(item => `${category.name}: ${item}`));
  return { score, status: score === 100 ? "complete" : "needs_revision", categories, completedRequirements, missingRequirements, errors: categories.flatMap(c => c.errors), suggestions: categories.flatMap(c => c.suggestions) };
}
module.exports = { evaluatePortfolio: evaluatePortal, rubric };
