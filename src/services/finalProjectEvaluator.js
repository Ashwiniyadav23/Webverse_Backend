const rubric = [
  { name: "HTML document structure and semantics", maxMarks: 15 },
  { name: "Headings, paragraphs, formatting, and lists", maxMarks: 10 },
  { name: "Links, images, and relative paths", maxMarks: 15 },
  { name: "Tables and multimedia", maxMarks: 10 },
  { name: "Forms and input attributes", maxMarks: 20 },
  { name: "Accessibility", maxMarks: 15 },
  { name: "HTML correctness and organization", maxMarks: 10 },
  { name: "Project explanation and completion", maxMarks: 5 },
];

const has = (html, regex) => regex.test(html);
const count = (html, regex) => [...html.matchAll(regex)].length;

function evaluatePortfolio(files) {
  const htmlFiles = files.filter((file) => /\.html?$/i.test(file.path));
  const html = htmlFiles.map((file) => file.content).join("\n");
  const readme = files.find((file) => /(^|\/)readme\.md$/i.test(file.path));
  const filePaths = new Set(files.map((file) => file.path.toLowerCase()));
  const categories = rubric.map(({ name, maxMarks }) => ({
    name, marks: 0, maxMarks, completedRequirements: [], missingRequirements: [], errors: [], suggestions: [],
  }));
  const add = (categoryIndex, ok, label, suggestion, error) => {
    const category = categories[categoryIndex];
    if (ok) {
      category.completedRequirements.push(label);
    } else {
      category.missingRequirements.push(label);
      category.suggestions.push(suggestion);
      if (error) category.errors.push(error);
    }
  };

  const doc = /<!doctype\s+html\s*>/i.test(html);
  add(0, doc, "HTML doctype is present", "Add <!doctype html> at the top of the document.");
  add(0, /<html\b[^>]*\blang\s*=\s*["'][^"']+["']/i.test(html), "HTML language is declared", "Add a meaningful lang attribute to the html element.");
  add(0, /<head\b[\s\S]*?<title\b[^>]*>\s*[^<]+<\/title>[\s\S]*?<\/head>/i.test(html), "Head contains a descriptive title", "Add a non-empty title inside head.");
  add(0, /<header\b/i.test(html) && /<nav\b/i.test(html) && /<main\b/i.test(html) && /<footer\b/i.test(html), "Semantic header, nav, main, and footer landmarks are present", "Use header, nav, main, and footer to identify the page regions.");
  add(0, count(html, /<section\b/gi) >= 2, "Content is grouped into sections", "Group related portfolio content in headed sections.");

  add(1, /<h1\b/i.test(html), "A primary heading is present", "Add one clear page heading with h1.");
  add(1, /<h[2-6]\b/i.test(html), "Subheadings organize the page", "Use section headings to create a readable outline.");
  add(1, /<p\b/i.test(html), "Paragraphs introduce and describe content", "Write short descriptive paragraphs using p elements.");
  add(1, /<(strong|em)\b/i.test(html), "Meaningful text formatting is used", "Use strong or em where the meaning calls for importance or emphasis.");
  add(1, /<(ul|ol)\b/i.test(html) && /<li\b/i.test(html), "Lists present interests or skills", "Use ul or ol with li items for interests and skills.");

  add(2, /<a\b[^>]*\bhref\s*=\s*["']#[^"']+["']/i.test(html) && /<a\b[^>]*\bhref\s*=\s*["']https?:\/\//i.test(html), "Internal and external links are present", "Include a fragment link and a descriptive external link.");
  const images = [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
  add(2, images.length >= 3, "At least three project images are present", "Add at least three project images.");
  const missingAlt = images.filter((image) => !/\balt\s*=\s*["'][^"']*["']/i.test(image));
  add(2, images.length > 0 && missingAlt.length === 0, "Images have alt attributes", "Give each image an alt attribute; describe informative images and use empty alt only for decorative images.", missingAlt.length ? `${missingAlt.length} image(s) are missing alt text.` : undefined);
  const localRefs = [...html.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/gi)].map((m) => m[1]).filter((path) => !/^(https?:|mailto:|tel:|#|data:|\/\/)/i.test(path) && !path.startsWith("/"));
  const missingPaths = localRefs.filter((path) => !filePaths.has(path.replace(/^\.\//, "").toLowerCase()));
  add(2, localRefs.length > 0 && missingPaths.length === 0, "Referenced local files are included", "Include every locally referenced file and match its relative path.", missingPaths.length ? `Unmatched local path(s): ${missingPaths.join(", ")}` : undefined);
  add(2, /<(article|section)\b[\s\S]*?<a\b[^>]*href=/i.test(html), "Project descriptions include links", "Give each project a description and a link to its page or demonstration.");

  add(3, /<table\b/i.test(html) && /<caption\b/i.test(html), "Education table includes a caption", "Add a caption that explains the education table.");
  add(3, /<th\b[^>]*\bscope\s*=\s*["'](col|row)["']/i.test(html), "Table uses scoped headers", "Use th with scope=\"col\" or scope=\"row\" for the data relationships.");
  add(3, /<(audio|video)\b[^>]*\bcontrols\b/i.test(html) || /<iframe\b[^>]*\btitle\s*=/i.test(html), "Audio, video, or titled embedded content is included", "Include media with controls or an embedded item with a descriptive title.");
  add(3, /<(audio|video)\b[^>]*>[\s\S]*?<\/\1>/i.test(html) || /<iframe\b/i.test(html), "Media has fallback text or an embed", "Provide fallback text for media elements or a titled iframe.");

  add(4, /<form\b[^>]*\baction\s*=\s*["'][^"']+["']/i.test(html) && /<form\b[^>]*\bmethod\s*=\s*["'](get|post)["']/i.test(html), "Contact form declares action and method", "Set a supported action and method on the contact form; explain if it is a demo endpoint.");
  add(4, /<input\b[^>]*\btype\s*=\s*["']text["'][^>]*>/i.test(html) && /<input\b[^>]*\btype\s*=\s*["']email["'][^>]*>/i.test(html) && /<textarea\b/i.test(html), "Name, email, and message controls use appropriate elements", "Add name, email, subject, and message controls with suitable input types.");
  add(4, /<input\b[^>]*\bname\s*=/i.test(html) && /<textarea\b[^>]*\bname\s*=/i.test(html), "Form controls have submission names", "Give each form control a distinct name.");
  add(4, /<label\b[^>]*\bfor\s*=/i.test(html) && /<input\b[^>]*\bid\s*=/i.test(html), "Labels are associated with form controls", "Match each label for value to a control id.");
  add(4, /<input\b[^>]*\brequired\b/i.test(html) && /<textarea\b[^>]*\brequired\b/i.test(html), "Required contact fields are marked", "Mark appropriate contact fields required and test browser validation.");
  add(4, /\bautocomplete\s*=/i.test(html), "Autocomplete is set where useful", "Use appropriate autocomplete tokens for name and email fields.");

  add(5, images.length > 0 && missingAlt.length === 0, "Images expose text alternatives", "Supply useful alt text for informative images.");
  const controls = [...html.matchAll(/<(input|textarea|select)\b[^>]*>/gi)].map((m) => m[0]);
  const labelFor = new Set([...html.matchAll(/<label\b[^>]*\bfor\s*=\s*["']([^"']+)["']/gi)].map((m) => m[1]));
  const unlabelled = controls.filter((tag) => {
    const id = tag.match(/\bid\s*=\s*["']([^"']+)["']/i)?.[1];
    return !id || !labelFor.has(id);
  });
  add(5, controls.length > 0 && unlabelled.length === 0, "Every form control has a matching label", "Associate each visible form control with a label using matching id and for attributes.", unlabelled.length ? `${unlabelled.length} form control(s) have no matching explicit label.` : undefined);
  add(5, /<form\b[^>]*>[\s\S]*?<button\b[^>]*type\s*=\s*["']submit["']/i.test(html), "Submit button has an explicit purpose", "Use a button with type=\"submit\" and clear text.");
  add(5, /<(audio|video)\b[^>]*\bcontrols\b/i.test(html) || /<iframe\b[^>]*\btitle\s*=/i.test(html), "Media controls or embed title support access", "Expose playback controls or give the embed a descriptive title.");
  add(5, /<form\b[\s\S]*?<p\b[^>]*id\s*=\s*["'][^"']+["'][^>]*>[\s\S]*?<\/p>[\s\S]*?<\/form>/i.test(html) && /aria-describedby\s*=/i.test(html), "Form includes instructions connected to controls", "Add concise instructions and connect them using aria-describedby.");

  add(6, htmlFiles.length > 0, "At least one HTML file is submitted", "Submit the main .html file and any additional HTML pages.");
  const duplicateIds = [...html.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map((m) => m[1]).filter((id, index, all) => all.indexOf(id) !== index);
  add(6, duplicateIds.length === 0, "IDs are unique", "Use each id value only once.", duplicateIds.length ? `Duplicate id(s): ${[...new Set(duplicateIds)].join(", ")}` : undefined);
  add(6, /<(head|body)\b[^>]*>[\s\S]*?<\/\1>/i.test(html), "Document has head and body sections", "Keep metadata in head and visible content in body.");
  add(6, !/<\s*(img|meta|input|br|hr)\b[^>]*>\s*<\s*\/\s*\1\s*>/i.test(html), "Void elements are not incorrectly closed", "Do not add closing tags to void elements such as img, meta, input, br, or hr.");

  add(7, Boolean(readme), "README.md explains the project and local use", "Include README.md with a project explanation and steps to open it locally.");

  for (const category of categories) {
    const requirementCount = category.completedRequirements.length + category.missingRequirements.length;
    category.marks = requirementCount
      ? Math.round(category.maxMarks * category.completedRequirements.length / requirementCount)
      : 0;
    if (!category.suggestions.length && category.missingRequirements.length) category.suggestions.push("Review the missing requirement and update the relevant section.");
  }
  const score = categories.reduce((sum, category) => sum + category.marks, 0);
  const completedRequirements = categories.flatMap((category) => category.completedRequirements.map((item) => `${category.name}: ${item}`));
  const missingRequirements = categories.flatMap((category) => category.missingRequirements.map((item) => `${category.name}: ${item}`));
  const errors = categories.flatMap((category) => category.errors);
  const suggestions = categories.flatMap((category) => category.suggestions);
  return { score, status: score === 100 ? "complete" : "needs_revision", categories, completedRequirements, missingRequirements, errors, suggestions };
}

module.exports = { evaluatePortfolio, rubric };
