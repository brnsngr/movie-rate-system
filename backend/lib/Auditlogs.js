const Enum = require('../config/enum');
const Auditlogs = require('../db/models/Auditlogs');

let instance = null;
class AuditLogs {
    constructor(){
        if(!instance){
            instance = this;
        }
        return instance;
    }

     async #saveToDB({username,location,proc_type,log,level}){
        await Auditlogs.create({
            username,
            location,
            proc_type,
            log,
            level
        });
        
    }

    info(username,location,proc_type,log){
        this.#saveToDB({
            username,
            location,
            proc_type,
            log,
            level:Enum.LOG_LEVELS.INFO,
        });

    }
    warn(username,location,proc_type,log){
        this.#saveToDB({
            username,
            location,
            proc_type,
            log,
            level:Enum.LOG_LEVELS.WARN,
        });

    }

    error(username,location,proc_type,log){
        this.#saveToDB({
            username,
            location,
            proc_type,
            log,
            level:Enum.LOG_LEVELS.ERROR,
        });

    }

    verbose(username,location,proc_type,log){
        this.#saveToDB({
            username,
            location,
            proc_type,
            log,
            level:Enum.LOG_LEVELS.VERBOSE,
        });

    }

    debug(username,location,proc_type,log){
        this.#saveToDB({
            username,
            location,
            proc_type,
            log,
            level:Enum.LOG_LEVELS.DEBUG,
        });

    }

    http(username,location,proc_type,log){
        this.#saveToDB({
            username,
            location,
            proc_type,
            log,
            level:Enum.LOG_LEVELS.HTTP,
        });

    }
}

module.exports = new AuditLogs();