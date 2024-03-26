const fs = require("fs-extra");
const chalk = require("chalk");

const COMMIT_REGEX =
  /^(revert: )?(feat|fix|docs|style|refactor|perf|build|chore|test)(\(.+\))?: .{1,72}/;

const GIT_COMMIT_FILE = process.env.HUSKY_GIT_PARAMS || ".git/COMMIT_EDITMSG";

const COMMIT_MSG = fs.readFileSync(GIT_COMMIT_FILE, "utf-8").trim();
console.log(chalk.green(`Verifying commit message: ${COMMIT_MSG}`));

if (!COMMIT_REGEX.test(COMMIT_MSG)) {
  console.log(
    chalk.bgRed.white("FL_ERROR:") +
      " Commit message does not match the commit format.",
  );
  console.log(
    chalk.yellow(
      "\n" +
        "- Use `feat(<feature name>):` to create a new feature.\n" +
        "- Use `fix(<bug number>):` to fix a bug.\n" +
        "- Use `docs(<documentation change>):` to update docs.\n" +
        "- Use `style(<style change>):` to update style.\n" +
        "- Use `refactor(<code change>):` to fix a code problem.\n" +
        "- Use `perf(<performance improvement>):` to improve performance.\n" +
        "- Use `build(<build change>):` to improve build system or CI.\n" +
        "- Use `chore(<chore change>):` for changes that don't modify src or test files.\n" +
        "- Use `test(<test change>)` to add or modify tests.\n",
    ),
  );
  // example:
  console.log(
    chalk.bgGreenBright("Example:") +
      "\n" +
      chalk.green("feat(<new-feature>): Add new feature") +
      "\n",
  );
  process.exit(1);
}
