import AmeyoLogger, { ILogHandler, ILogLevel } from 'js-logger';


AmeyoLogger.useDefaults();
AmeyoLogger.setLevel(AmeyoLogger.DEBUG);
// every time log is used this handler will get executed
AmeyoLogger.setHandler(function (messages, context) {
    consoleHandler(messages, context);

    //myHandler(messages, context);
});

//logging in console as well as saving log in localstorage
// always log page url also
const consoleHandler = AmeyoLogger.createDefaultHandler({
    formatter: function (messages, context) {
        // prefix each log message with a timestamp.
        var prefix = "";
        if (context.name) {
            prefix = "[" + context.name + "]" + " ";
        }
        let date = new Date();
        let key = createKeyToLog(date);
        let messageToLog = createMessageToLog(prefix, messages[0], date, context.level.name, key);
        localStorageLog(key, messageToLog);


        messages.unshift(prefix + formatDate(date));

    },
});


// can be set via query param dev mode value
//this will log in local storage also
const isClientLogEnabled = true;
var MAX_RANDOM_INT = Math.pow(2, 32);
var localCounter = 0;
const AMEYO_REMOTE_LOGGING_PREFIX = "RLog: ";


function createMessageToLog(prefix: string, message: any, logTime: Date, level: ILogLevel["name"], key: string) {

    var messageToLog = message + "";
    if (message.stack != undefined) {
        messageToLog = messageToLog + " " + message.stack;
    }
    // will add this 
    var sessionId = "";
    let ameyoClient: any;
    if (ameyoClient) {
        sessionId = ameyoClient.sessionId;
    }
    messageToLog = prefix + "[" + formatDate(logTime) + "] " + level + " [" + sessionId
        + "] " + " [" + key + "] " + messageToLog;

    return messageToLog;
}
function formatDate(date: Date) {

    let dformat = [(date.getFullYear()), ('0' + (date.getMonth() + 1)).slice(-2),
    ('0' + date.getDate()).slice(-2)].join('-')
        + ' '
        + [('0' + date.getHours()).slice(-2), ('0' + date.getMinutes()).slice(-2),
        ('0' + date.getSeconds()).slice(-2)].join(':');
    return dformat;
}

function createKeyToLog(logTime: Date) {
    return AMEYO_REMOTE_LOGGING_PREFIX + logTime.getTime() + "-"
        + Math.floor((Math.random() * MAX_RANDOM_INT) + 1);
}



//var consoleHandler = Logger.createDefaultHandler();
var myHandler: ILogHandler = function (messages, context) {
    // console.log( { message: messages[0], level: context.level });
    let myMsg = "";
    if (context.name) {
        myMsg = context.name + " ";

    }
    myMsg = myMsg + messages[0];
    console.log(myMsg);
};




function localStorageLog(key: string, messageToLog: any) {
    try {
        if (isClientLogEnabled) {
            if (localStorage)
                localStorage.setItem(key, messageToLog);
        }
    } catch (e) {
        localStorage.clear();
        console.info("local storage cleared");
    }
}

// Logger.sendData = function () {
//     console.log("sending data to server");

// }

//listen all uncaught error
window.onerror = function (message, source, lineno, colno, error) {

    AmeyoLogger.error(error);
}
export default AmeyoLogger;

// const AmeyoLogger = {
//   log: function log(msg: any) {
//     let prefix = "[AmeyoLogger] ";
//     console.log(prefix + msg);
//   }
// }

// export default AmeyoLogger;


