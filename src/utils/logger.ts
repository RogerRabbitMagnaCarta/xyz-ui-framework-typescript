export function log(message: string): void {
    console.log(`[LOG] ${new Date().toISOString()} - ${message}`);
  }
  
  export function error(message: string): void {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
  }
  
  