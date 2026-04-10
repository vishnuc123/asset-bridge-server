import pino from "pino"
import path from "path"

const attachfolder = path.join(process.cwd(),"logs")


export const logger = pino({
  transport:{
    targets:[
      {
        target:"pino/file",
        options:{destination:path.join(attachfolder,"backend.log")}
      },
      {
        target:"pino/file",
        level:"error",
        options:{destination:path.join(attachfolder,"error.log")}
      }
    ]
  }
})