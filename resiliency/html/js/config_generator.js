var br = "<br>";
var TAB = "&nbsp;&nbsp;";
var left = "&lt;";
var right = "&gt;";

var config0 = "depositService = {";
var config1 = "}";

var circuitBreaker = TAB + "callRemoteService.circuitBreaker = {";
var cb0 = TAB + TAB + "openCircuitErrorPercentage = 60";
var cb1 = TAB + TAB + "sleepWindowDuration = 5";
var cb_comment = TAB + TAB + "#the Unit is in lieu with Enum constant of java.util.concurrent.TimeUnit"
var cb2 = TAB + TAB + "sleepWindowDurationUnit = \"SECONDS\"";
var cb3 = TAB + TAB + "timeout = 2";
var cb4 = TAB + TAB + "timeoutUnit = \"SECONDS\"";

var cache = TAB + "callRemoteService.cache = {";
var cache0 = TAB + TAB + "maxNumCachedItems = 128";
var cache1 = TAB + TAB + "timeToLive = 30";
var cache2 = TAB + TAB + "timeToLiveUnit = \"SECONDS\"";
var cache3 = TAB + TAB + "useOnFailure = true";

var bulkhead = TAB + "callRemoteService.bulkhead = {";
var bh0 = TAB + TAB + "numConcurrentRequest = 20";
var bh_comment = TAB + TAB + "#if strategy is BulkheadStrategy.WITHOUT_QUEUE, then queueSize will be ignored";
var bh1 = TAB + TAB + "queueSize = 10";
var bh2 = TAB + TAB + "strategy = BulkheadStrategy.WITH_QUEUE";

var retry = TAB + "callRemoteService.retry = {";
var retry0 = TAB + TAB + "maxRetries = 3";
var retry1 = TAB + TAB + "delayPeriod = 1";
var retry2 = TAB + TAB + "delayPeriodUnit = \"MILLISECONDS\"";
var retry3 = TAB + TAB + "backoffDelayFactor = 1.2";
var retry_comment = TAB + TAB + "#if both maxRetryDuration and maxRetries are specified, maxRetries will be used";
var retry4 = TAB + TAB + "maxRetryDuration = 200";
var retry5 = TAB + TAB + "maxRetryDurationUnit = \"MICROSECONDS\"";
var retry6 = TAB + TAB +"onExceptions = [" + br +
    TAB + TAB + TAB + "java.lang.RuntimeException, " + br +
    TAB + TAB + TAB + "java.net.ConnectException" + br + TAB + TAB +"]";

var rollingWindow = TAB + "callRemoteService.rollingWindow = {";
var rw0 = TAB + TAB + "numSlots = 10";
var rw1 = TAB + TAB + "slotDuration = 2";
var rw2 = TAB + TAB + "slotDurationUnit = \"SECONDS\"";

function showConfig () {
    var input = document.getElementsByTagName("input");
    var i;
    var counter = 0;
    var sample = config0.fixed();
    for (i=0; i< input.length; i++) {
        if (input[i].getAttribute("type") == "checkbox" && input[i].checked) {
            counter ++;
            switch (input[i].name) {
                case "CircuitBreaker":
                    sample = sample + br + circuitBreaker.fixed().fontcolor("green") + br
                        + cb0.fixed() + br + cb1.fixed() + br + cb_comment.fontcolor("grey").italics().fixed() +
                            br + cb2.fixed() + br + cb3.fixed() + br + cb4.fixed() + br + TAB + config1.fixed().fontcolor("green");
                    break;
                case "Bulkhead":
                    sample = sample + br + bulkhead.fixed().fontcolor("green") + br + bh0.fixed() + br
                        + bh_comment.fontcolor("grey").italics().fixed() + br
                        + bh1.fixed() + br + bh2.fixed() + br + TAB + config1.fixed().fontcolor("green");
                    break;
                case "Retry":
                    sample = sample + br + retry.fixed().fontcolor("green") + br + retry0.fixed() + br + retry1.fixed() + br +
                            retry2.fixed() + br + retry3.fixed() + br + retry_comment.fontcolor("grey").italics().fixed() + br +
                            retry4.fixed() + br + retry5.fixed() + br + retry6.fixed() + br + TAB + config1.fixed().fontcolor("green");
                    break;
                case "RollingWindow":
                    sample = sample + br + rollingWindow.fixed().fontcolor("green") + br + rw0.fixed() + br + rw1.fixed() + br +
                            rw2.fixed() + br + TAB + config1.fixed().fontcolor("green");
                    break;
                case "Cache":
                    sample = sample + br + cache.fixed().fontcolor("green") + br + cache0.fixed() + br + cache1.fixed() + br +
                            cache2.fixed() + br + cache3.fixed() + br + TAB + config1.fixed().fontcolor("green");
                    break;
                default:
            }
        }
    }
    if (counter > 0) {
        sample = sample + br + config1.fixed();
        sampleCode.innerHTML = sample;
    } else {
        sampleCode.innerHTML = br + "There is no resiliency feature selected!".fontcolor("orange");
    }
}


