import { argv } from 'node:process';

function main() {
    if (argv.length < 3) {
        console.error("Please provide a URL as an argument.");
        process.exit(1);
    }

    if (argv.length > 3) {
        console.error("Too many arguments provided. Please provide only one URL.");
        process.exit(1);
    }

    const baseUrl = argv[2];
    console.log(`Starting crawl of: ${baseUrl}`);
    process.exit(0);
}

main();