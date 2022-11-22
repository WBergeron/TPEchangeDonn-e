import mongoose from 'mongoose';
import chalk from 'chalk';

export default async () => {

    const url = process.env.DATABASE;
    console.log(chalk.green(`[MONGO] - Establish new connection with url: ${url}`));

    try {
        await mongoose.connect(url);
        console.log(chalk.green(`[MONGO] - Connected to: ${url}`)); 
    } catch(err) {
        console.log(chalk.red(`[MONGO] - Cannot connect to: ${url}\n ${err} ... \n Exiting`));
        process.exit(1);
    }
    
}