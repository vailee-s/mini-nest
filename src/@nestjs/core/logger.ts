import clc from "cli-color";
export class Logger {
  static log(message: string, context: string = "") {
    console.log(message);
    const timestamp = new Date().toLocaleString();
    // 获取当前进程id
    const pid = process.pid;
    console.log(
      `[${clc.green("Nest")}] ${clc.green(pid.toString())} - ${clc.yellow(
        timestamp
      )} ${clc.green("LOG")} [${clc.yellow(context)}] ${clc.green(message)} `
    );
  }
}
