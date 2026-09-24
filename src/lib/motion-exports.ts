// The only parts of motion the site uses. Imported dynamically by ./motion.ts;
// re-exporting by name lets the bundler drop the rest of the library (a bare
// `import("motion")` keeps every export and nearly triples the chunk).
export { animate } from "motion"
