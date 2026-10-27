const sections = [
  {
    title: "CSS Fundamentals & Global Styling",
    topics: [
      ["CSS and external stylesheets", "CSS describes how HTML should look. An external file keeps styling reusable across pages.", "Create style.css beside your HTML and connect it with <link rel=\"stylesheet\" href=\"style.css\"> inside head.", "body { color: #243247; }", "The page text becomes dark blue-gray.", ["Keep the link element in head.", "Check that the file name and path match."]],
      ["Rules, selectors, properties, and values", "A CSS rule selects elements and assigns property values.", "Write selector { property: value; }. A selector can be an element, class, or ID.", "h1 { color: navy; font-size: 2rem; }", "All h1 headings become navy and larger.", ["Close the declaration with a semicolon.", "Use a colon between property and value."]],
      ["Global styles and box sizing", "A reset gives pages a predictable starting point.", "Use the universal selector for box sizing and set body font, line height, margin, and background.", "* { box-sizing: border-box; } body { margin: 0; font-family: Arial, sans-serif; line-height: 1.6; background: #f4f6fa; }", "Elements include padding and border in their declared width; the page has consistent spacing and type.", ["The universal selector is *.", "Separate rules for * and body."]],
    ], tasks: ["Style the page background and body text using a readable font and line height.", "Add a universal box-sizing rule and remove the browser's default body margin."],
    quiz: [["Which file extension is commonly used for an external stylesheet?", [".html", ".css", ".js", ".png"], 1, "External CSS is usually saved in a .css file."], ["What does box-sizing: border-box change?", ["Padding and border count inside declared width", "Every box becomes a border", "Margins disappear", "Text becomes bold"], 0, "The declared width includes content, padding, and border."], ["What is wrong with h1 { color blue }?", ["It needs a colon after color", "h1 cannot be selected", "blue needs quotes", "It needs HTML tags"], 0, "Declarations use a colon between property and value."]],
    assessment: ["Style a study notice page with a pale background, readable body type, centered content width, and a distinct page heading.", ["body", "h1", "max-width", "margin", "background", "font-family", "color"], ["box-sizing", "line-height"]],
  },
  {
    title: "Typography, Colors & Navigation",
    topics: [
      ["Headings and paragraphs", "Typography creates a clear reading order.", "Set font sizes, weights, line heights, and spacing for h1 through h6 and paragraphs.", "h1 { font-size: 2.5rem; line-height: 1.1; } p { line-height: 1.7; }", "The heading has a strong hierarchy and paragraphs are comfortable to read.", ["Use rem for scalable type.", "Avoid making every heading the same size."]],
      ["Page regions and colors", "Consistent colors help visitors understand page regions.", "Style header, nav, main, and footer with background, color, padding, and width.", "header { background: #17324d; color: white; padding: 1rem; }", "The header becomes a contrasting band.", ["Check text contrast against backgrounds.", "Padding creates space inside an element."]],
      ["Links and pseudo-classes", "Pseudo-classes style links in different interaction states.", "Use a:hover, a:visited, and a:active rules; keep link text distinguishable.", "a:hover { color: #d35400; } a:active { color: #8e2a00; }", "Links change color when hovered or pressed.", ["Write pseudo-classes directly after the selector.", "Visited styling applies only after a link was visited."]],
    ], tasks: ["Give a page heading, paragraph, header, and footer a consistent color and type scale.", "Style links with distinct default, hover, visited, and active states."],
    quiz: [["Which pseudo-class styles a link while the pointer is over it?", [":visited", ":hover", ":active", ":focus"], 1, ":hover applies while pointing at an element."], ["Which property sets text size?", ["font-size", "text-style", "line-height", "background"], 0, "font-size controls the size of text."], ["Predict: a:visited { color: purple }. What changes?", ["Previously visited links", "All headings", "Only active buttons", "The page background"], 0, "The visited state applies to links the browser records as visited."]],
    assessment: ["Create a visual style for a community announcement with a deep-color header, readable heading and paragraph sizes, and clear interactive navigation links.", ["header", "nav", "h1", "p", "font-size", ":hover", "color"], ["background", "line-height"]],
  },
  {
    title: "Profile Page & Box Model",
    topics: [
      ["Image sizing and cropping", "Image styles keep profile photos tidy without distorting them.", "Set width, height, border, border-radius, and object-fit; use auto margins to center a block image.", "img { width: 10rem; height: 10rem; object-fit: cover; border-radius: 50%; display: block; margin: 1rem auto; }", "A centered circular crop fills a square image box.", ["object-fit: cover keeps the image proportions while cropping.", "A block image can be centered with auto side margins."]],
      ["The box model", "Every element is a box made of content, padding, border, and margin.", "Padding is inside the border; margin creates space outside it.", ".profile-card { padding: 1.5rem; border: 1px solid #ccd5df; margin: 2rem auto; }", "The card has inner breathing room and space around it.", ["Use developer tools to see each box layer.", "Margins on children can affect nearby spacing."]],
      ["Profile content spacing", "Consistent spacing makes profile details easy to scan.", "Use margins, padding, and borders on headings, paragraphs, and lists.", ".profile-card li { margin-block: .5rem; }", "List items have comfortable vertical spacing.", ["Use one spacing scale throughout.", "Do not use repeated spaces in text to create layout."]],
    ], tasks: ["Style a profile photo as a centered circular crop with a visible border.", "Create a profile card with balanced padding, margin, border, and list spacing."],
    quiz: [["Which property crops an image to fill its box?", ["object-fit", "font-fit", "image-shape", "overflow-text"], 0, "object-fit controls how replaced content fits its box."], ["Which box model layer sits outside the border?", ["Content", "Padding", "Margin", "Line height"], 2, "Margin is outside the border."], ["Why use box-sizing: border-box?", ["Declared width includes padding and border", "It removes all borders", "It centers images", "It changes image color"], 0, "Border-box makes sizing easier to predict."]],
    assessment: ["Design a volunteer profile card with a cropped portrait, a compact contact detail list, and a clear border and spacing system.", ["img", "object-fit", "border-radius", "padding", "border", "margin", "li"], ["width", "height"]],
  },
  {
    title: "Courses Page — Flexbox",
    topics: [
      ["Course cards and flex containers", "Flexbox lays out items along one direction and can wrap them.", "Set display: flex on a parent, then use flex-wrap and gap for a row of cards.", ".cards { display: flex; flex-wrap: wrap; gap: 1rem; } .card { flex-basis: 14rem; }", "Cards form rows and wrap when there is not enough room.", ["display:flex belongs on the parent.", "gap belongs on the flex container."]],
      ["Direction, growth, and alignment", "Flex properties distribute available room and align items.", "Use flex-direction to change the main axis, flex-grow to share extra room, and justify-content/align-items to align.", ".card { flex-grow: 1; } .cards { justify-content: center; align-items: stretch; }", "Cards share extra room and align consistently.", ["The main axis changes with flex-direction.", "Use flex-basis to set a starting size."]],
      ["Flexbox Froggy practice", "A short game gives extra practice with flex alignment.", "Try Flexbox Froggy and map each game instruction to a container property.", "display: flex; justify-content: space-between;", "Items move along the flex container's main axis.", ["Change the parent, not each frog item.", "Use the game as practice alongside your page work."]],
    ], tasks: ["Build a wrapping set of course cards with a consistent gap and useful minimum card width.", "Make cards grow evenly and change their direction on a narrow preview."],
    quiz: [["Where does display:flex go?", ["On the flex container", "On the browser", "Only on text nodes", "In an HTML attribute"], 0, "The parent becomes a flex container."], ["Which property creates space between flex items?", ["gap", "padding-left", "text-indent", "border-spacing"], 0, "gap sets spacing between flex items."], ["What does flex-wrap: wrap allow?", ["Items move to another line", "Text is hidden", "Items overlap", "The page scrolls to top"], 0, "Wrapping makes another flex line when space runs out."]],
    assessment: ["Arrange workshop session cards that wrap across the page, share available room, and switch to a vertical stack on narrow screens.", ["display: flex", "flex-wrap", "gap", "flex-grow", "flex-direction"], ["flex-basis", "justify-content"]],
  },
  {
    title: "Courses Page — CSS Grid",
    topics: [
      ["Grid columns and responsive tracks", "Grid arranges content in rows and columns.", "Use display:grid and repeat(auto-fit, minmax(...)) to create flexible columns.", ".course-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr)); gap: 1rem; }", "Cards form as many columns as fit and then wrap automatically.", ["minmax sets a lower and upper track size.", "auto-fit fits the available number of tracks."]],
      ["Grid placement and alignment", "Grid items can span or align within named cells.", "Use grid-column, grid-row, grid-area, justify-self, and align-self when an item needs special placement.", ".featured { grid-column: span 2; justify-self: stretch; }", "The featured item spans two columns.", ["Spans must fit available tracks.", "Automatic placement fills remaining cells."]],
      ["Grid Garden practice", "Grid Garden offers extra practice with grid tracks and placement.", "Try Grid Garden and relate each solution to a grid container or item property.", "display: grid; grid-template-columns: repeat(3, 1fr);", "Items are placed into a three-column grid.", ["Set tracks on the parent.", "Place individual items only when the automatic order is not enough."]],
    ], tasks: ["Create an auto-fitting course grid with minimum-width cards and even gaps.", "Make one feature card span columns and align a call-to-action inside its cell."],
    quiz: [["Which function can set a flexible grid track range?", ["minmax()", "fittext()", "grow()", "column()"], 0, "minmax defines a minimum and maximum track size."], ["What does auto-fit help do?", ["Fit as many tracks as space allows", "Fit text to an image", "Hide rows", "Center all content"], 0, "auto-fit repeats tracks that fit the grid container."], ["Which property places an item across columns?", ["grid-column", "flex-basis", "column-gap-only", "align-self"], 0, "grid-column controls an item's column placement or span."]],
    assessment: ["Create a responsive resource library grid with variable card widths, comfortable gaps, and one wide featured resource.", ["display: grid", "grid-template-columns", "repeat(", "auto-fit", "minmax(", "gap", "grid-column"], ["justify-self", "align-self"]],
  },
  {
    title: "Feedback Form Styling",
    topics: [
      ["Form controls", "Forms work best when every field is easy to identify and use.", "Style labels, inputs, textarea, select, and buttons with width, padding, border, radius, and font size.", "input, textarea, select { width: 100%; padding: .7rem; border: 1px solid #9aa9b8; border-radius: .5rem; }", "Controls line up and have comfortable click and typing areas.", ["Include labels in the visual design.", "Use width:100% only when the parent has a useful width."]],
      ["Focus and hover states", "Visible interaction states help people know which control is active.", "Use :focus or :focus-visible and :hover; keep clear contrast around controls.", "input:focus { outline: 3px solid #62a8ff; } button:hover { background: #17324d; }", "Keyboard focus and pointer hover are easy to see.", ["Do not remove focus indication without replacing it.", "Use focus-visible to support keyboard users."]],
      ["Friendly form layout", "A clear form groups related questions and gives its submit action room.", "Use spacing, readable fonts, and a consistent button style.", ".field { margin-block: 1rem; } button { padding: .75rem 1rem; cursor: pointer; }", "Fields have breathing room and the button looks actionable.", ["Keep helper text close to the field.", "Avoid low-contrast placeholder-only labels."]],
    ], tasks: ["Style a feedback form so text controls fill their container and labels have clear spacing.", "Add keyboard focus and button hover styles with visible contrast."],
    quiz: [["Which selector targets a field while it has keyboard focus?", [":focus", ":visited", ":nth-child", ":root"], 0, ":focus matches the active control."], ["What should remain visible for keyboard users?", ["A focus indicator", "Only placeholder text", "Nothing", "Hover color only"], 0, "Keyboard users need an obvious focus state."], ["Which property adds room inside an input border?", ["padding", "margin", "gap", "outline-offset"], 0, "Padding adds inner space around the value."]],
    assessment: ["Style a library reservation form with aligned labels, comfortable controls, and a clear keyboard focus treatment.", ["label", "input", "textarea", "select", "button", "padding", ":focus"], ["border-radius", ":hover"]],
  },
  {
    title: "Grades Table Styling",
    topics: [
      ["Table structure and spacing", "Tables need visual structure so data rows and headings are easy to compare.", "Style table, th, and td; use border-collapse and cell padding.", "table { width: 100%; border-collapse: collapse; } th, td { padding: .75rem; border-bottom: 1px solid #ccd5df; }", "Borders meet cleanly and cells have breathing room.", ["Apply padding to cells.", "Keep each column understandable."]],
      ["Row striping and hover", "Alternate row colors help readers track across wide data.", "Use tbody tr:nth-child(even) for stripes and tr:hover for interactive feedback.", "tbody tr:nth-child(even) { background: #edf3f8; } tr:hover { background: #dcecff; }", "Even rows have a subtle tint and the pointer row is highlighted.", ["nth-child(even) matches every second sibling.", "Keep hover colors readable."]],
      ["Small-screen table access", "Wide tables can remain usable on a small screen with a scroll wrapper.", "Allow the wrapper to scroll horizontally and give the table a sensible minimum width.", ".table-wrap { overflow-x: auto; }", "A narrow screen can scroll the table without squeezing every column.", ["Put overflow on the wrapper around the table.", "Do not hide important columns."]],
    ], tasks: ["Style a grades table with collapsed borders, padded cells, and alternate row colors.", "Add a row hover state and a horizontally scrollable wrapper."],
    quiz: [["Which value makes table borders share a single line?", ["collapse", "striped", "inline", "compact"], 0, "border-collapse: collapse joins adjacent borders."], ["What does tr:nth-child(even) select?", ["Every second row", "The last row only", "Every column", "Header text"], 0, "even selects matching even-numbered siblings."], ["Where should overflow-x:auto go for a scrollable table?", ["On a wrapper around the table", "On every cell", "On body only", "On the caption"], 0, "A wrapper can scroll the table as one unit."]],
    assessment: ["Style a reading log table with clear header cells, alternating records, a subtle hover state, and mobile horizontal scrolling.", ["table", "th", "td", "border-collapse", ":nth-child(even)", "tr:hover", "overflow-x"], ["padding", "border"]],
  },
  {
    title: "Contact Page Styling",
    topics: [
      ["Consistent contact details", "A contact page should make ways to reach the organization easy to scan.", "Reuse the site's spacing, colors, typography, borders, and link states.", ".contact-card { padding: 1.25rem; border-left: 4px solid #3478a8; }", "Contact details have a clear visual grouping.", ["Use the same color roles used elsewhere.", "Keep addresses and email links readable."]],
      ["Readable contact links", "Contact links should look clickable and remain easy to read.", "Style links with contrast, hover, focus, and comfortable spacing.", ".contact a:focus-visible { outline: 2px solid #174f7a; }", "Keyboard navigation shows a clear outline.", ["Do not rely on color alone to signal a link.", "Give links enough surrounding space."]],
    ], tasks: ["Create a contact information card using the site's established spacing and color choices.", "Style contact links for hover and keyboard focus."],
    quiz: [["Which property adds space inside a contact card?", ["padding", "margin", "gap", "line-style"], 0, "Padding is the inner space."], ["What helps users recognize a link beyond its color?", ["Underline or another visible treatment", "Smaller text", "Hidden focus", "Lower contrast"], 0, "A visible non-color cue helps link recognition."], ["Which selector supports a visible keyboard outline?", [":focus-visible", ":visited", ":nth-child", ":root"], 0, ":focus-visible targets keyboard-style focus indication."]],
    assessment: ["Design a contact panel for a local arts club with readable address details and keyboard-visible email and phone links.", ["contact", "padding", "border", "a:focus-visible"], ["color", "line-height"]],
  },
  {
    title: "Responsive Web Design",
    topics: [
      ["Media queries and breakpoints", "Responsive rules adapt a layout to available screen space.", "Use @media rules around 768px and 480px to adjust navigation, cards, fonts, and spacing.", "@media (max-width: 768px) { nav ul { flex-direction: column; } }", "Navigation items stack on tablet and smaller screens.", ["Keep base styles outside the query.", "Put the condition in parentheses."]],
      ["Responsive cards and type", "Cards and text need room to fit without horizontal overflow.", "Change grid columns, card widths, font sizes, and page padding at smaller breakpoints.", "@media (max-width: 480px) { main { padding: 1rem; } h1 { font-size: 1.8rem; } }", "Small screens use less page padding and a smaller heading.", ["Test at the breakpoint and below it.", "Prefer flexible widths before adding breakpoints."]],
      ["Mobile tables and device checks", "A responsive site keeps important information available on small screens.", "Make table wrappers scrollable, then check desktop, tablet, and mobile widths.", "@media (max-width: 480px) { .table-wrap { overflow-x: auto; } }", "The table remains available without forcing the page wider.", ["Check every page at all three widths.", "Look for clipped content and tiny tap targets."]],
    ], tasks: ["Stack navigation and adjust card columns at tablet and phone widths.", "Make the grades table scroll within its wrapper and tune mobile text and spacing."],
    quiz: [["Which rule begins a media query?", ["@media", "@screen", "@responsive", "@width"], 0, "@media applies CSS only when its condition matches."], ["At which width should the curriculum's phone adjustments begin?", ["480px", "1200px", "1024px", "200px"], 0, "The supplied breakpoint is 480px."], ["How can a wide table remain usable on a phone?", ["Scroll its wrapper horizontally", "Hide all rows", "Shrink text to 4px", "Remove table headers"], 0, "A horizontally scrollable wrapper preserves the table information."]],
    assessment: ["Make a volunteer directory work at desktop, tablet, and phone widths, with stacked navigation, adaptable cards, and readable type and spacing.", ["@media", "768px", "480px", "flex-direction", "grid-template-columns", "font-size"], ["overflow-x", "padding"]],
  },
];

const topic = ([tag, what, why, how, example, output, mistakes]) => ({ tag, what, why, how, example, output, mistakes });
const taskChecks = [
  [["body", "background", "font-family", "line-height"], ["box-sizing", "margin", "0"]],
  [["h1", "p", "header", "font-size", "color"], ["a:hover", "a:visited", "a:active", "color"]],
  [["img", "object-fit", "border-radius", "margin"], ["border", "padding", "margin"]],
  [["display: flex", "flex-wrap", "gap", "flex-basis"], ["flex-grow", "flex-direction", "justify-content"]],
  [["display: grid", "grid-template-columns", "auto-fit", "minmax(", "gap"], ["grid-column", "justify-self"]],
  [["label", "input", "textarea", "select", "padding"], [":focus", "button:hover", "outline"]],
  [["table", "border-collapse", "th", "td", "padding"], ["nth-child(even)", "tr:hover", "overflow-x"]],
  [["contact", "padding", "border", "color"], ["a:hover", "a:focus-visible", "line-height"]],
  [["@media", "768px", "nav", "flex-direction"], ["480px", "overflow-x", "font-size", "padding"]],
];
const cssExample = `.site-header { background: #17324d; color: white; padding: 1rem; }\nmain { max-width: 70rem; margin: 2rem auto; padding: 1rem; }\na:hover { color: #d35400; }`;
const makeSection = (section, index) => {
  const tasks = section.tasks.map((instructions, taskIndex) => ({
    title: `${["Beginner", "Intermediate"][taskIndex]} practice`, instructions,
    starterCode: taskIndex ? "/* Add a focused CSS rule below */\n" : "/* Write CSS rules below */\n",
    validation: { requiredText: taskChecks[index][taskIndex] },
  }));
  return {
    language: "css", topics: section.topics.map(topic), tasks,
    quiz: section.quiz.map(([prompt, options, answerIndex, explanation], i) => ({ type: ["mcq", "output", "error"][i], prompt, options, answerIndex, explanation, snippet: i === 1 ? cssExample : "" })),
    assessment: { title: `Section ${index + 1} practical assessment`, prompt: section.assessment[0], starterCode: "/* Plan your rules, then write your CSS */\n", validation: { requiredText: section.assessment[1] }, testCases: section.assessment[1].map(value => `Your stylesheet includes ${value} where appropriate.`), criteria: ["Use selectors and declarations that match the brief", "Apply the section's main CSS techniques", "Keep rules readable and purposeful"] },
  };
};

module.exports = sections.map(makeSection);
