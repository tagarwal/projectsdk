var br = "<br>";
var TAB = "&nbsp;&nbsp;";

var bh = "numConcurrentRequests=20, queueSize=5, strategy=BulkheadStrategy.WITH_QUEUE";
var rollingWindow = "numSlots=10, slotDuration=1, slotDurationUnit=TimeUnit.SECONDS";
var retry = "maxRetries=3, delayPeriod=1, delayPeriodUnit=TimeUnit.SECONDS, onExceptions=ConnectException.class";
var cb = "openCircuitErrorPercentage=60, sleepWindowDuration=5, sleepWindowDurationUnit=TimeUnit.SECONDS";
var cache = "useForFailure=true, timeToLive=30, timeToLiveUnit=TimeUnit.SECONDS";
var fallback = TAB + "public String myFallback(FallbackContext context) {" + br
    + TAB + "   return \"This is the result of Fallback Function\";" + br + TAB + " }" + br;

var cbc = "CircuitBreaker Configuration: ";
var bhc = "Bulkhead Configuration: ";
var rollingWindowc = "RollingWindow Configuration: ";
var retryc = "Retry Configuration: ";
var cachec = "Cache Configuration: ";
var fallbackc = "Fallback method: ";

var cacheConfig = "@Cache(useForFailure = true, timeToLive = 30, timeToLiveUnit = TimeUnit.SECONDS)";
var cbConfig = "@CircuitBreaker(openCircuitErrorPercentage = 60, sleepWindowDuration = 5, sleepWindowDurationUnit = TimeUnit.SECONDS)";
var rollingWindowConfig = "@RollingWindow(numSlots = 10, slotDuration = 1, slotDurationUnit = TimeUnit.SECONDS)";
var retryConfig = "@Retry(maxRetries = 3, delayPeriod = 1, delayPeriodUnit = TimeUnit.SECONDS)";
var bulkheadConfig = "@Bulkhead(numConcurrentRequests = 20, queueSize = 5, strategy = BulkheadStrategy.WITH_QUEUE)";
var fallbackMethod = "@Fallback(applyTo = \"callRemoteService\")";
var fallbackAll = "@Fallback(applyTo = {\"callRemoteService\", \"anotherMethod\"})";
var resilientClass = "public class ResilientClass {" + br;
var resilient_method = TAB + "public String callRemoteService() {" + br +
    TAB + TAB + "return RemoteService.getResult();" + br + TAB + "}";
var another_method = TAB + "public String annotherMethod() {" + br +
    TAB + TAB + "return localCall();" + br + TAB + "}" + br + "}";

var comment_cache = "//Resiliency instance with Cache configured, everytime the method" + br +
    "//is invoked, and if it succeeds, the result will be cached (for the first time) or the cache will be" + br +
    "//updated with the latest result. The cached result will be available for 30 seconds." + br +
    "//If cache has been updated for this method, the timer will be rest. Then for any failure case, if the cache" + br +
    "//is still available, the cached result will be returned";

var comment_cb = "//Resiliency instance with CircuitBreaker configured, the statistics is calcaluted based on" + br +
    "//rollingWindow (if not configured, use default). If the error rate reaches 60%, the circuit will open, " + br +
    "//any request within the next 5 seconds (sleepWindow), will be rejected immediately or return a fallback result " + br +
    "//if configured. Then after 5 seconds, if there are more requests coming, 1 of them will be allowed to go through as a tester, " + br +
    "//(CircuitBreaker in half open state) if the tester succeeds, CircuitBreaker will close, and further requests are allowed, " + br +
    "//if the tester fails, CircuitBreaker will remain open for another 5 seconds, and repeat such process." + br +
    "//During half open states, only 1 request will be acted as tester, the rest will be rejected";

var comment_retry = "//Resiliency instance with Retry configured, if a ConnectionException is thrown by the method, " + br +
    "//it will retry for 3 times, with 1 second delay between each retry";

var comment_bh = "//Resiliency instance with Bulkhead configured, at any time, there will be only 20 concurrent requests allowed" + br +
    "//and additional 5 requests allowed to be queued, the rest of the requests will be rejected immediately " + br +
    "//or return fallback result if configured.";

var comment_rollingWindow = "//At class level only! Resiliency instance with RollingWindow configured, it is used to calculate the statistics of Resiliency";

var comment_fallback = "//this is the alternative result will be returned in case of any failure for method \"callRemoteService\"";

var comment_fallbackAll = "//this is the alternative result will be returned in case of any failure for method \"callRemoteService\" and \"anotherMethod\"" + br +
    "//You can just simply apply @Fallback, which will apply this Fallback method to all methods in this class" + br +
    "//Or alternatively, you can use \"applyTo\" to specify a list of methods that this fallback method is applicable" + br +
    "//Notice that, the fallback Method must have the same return type as the business method(s) specified in \"applyTo\" list";

function revealProperty(feature) {
    if(feature.checked) {
        var input = document.createElement("text");
        var div = document.createElement("div");
        div.id = feature.name;
        switch (feature.name) {
            case "CircuitBreaker":
                div.innerHTML = cbc.fontcolor("green").bold() + cb.small().fixed();
                break;
            case "Bulkhead":
                div.innerHTML = bhc.fontcolor("brown").bold() + bh.small().fixed();
                break;
            case "Retry":
                div.innerHTML = retryc.fontcolor("blue").bold() + retry.small().fixed();
                break;
            case "RollingWindow":
                div.innerHTML = rollingWindowc.fontcolor("red").bold() + rollingWindow.small().fixed();
                break;
            case "Cache":
                div.innerHTML = cachec.fontcolor("purple").bold() + cache.small().fixed();
                break;
            case "Fallback":
                div.innerHTML = fallbackc.fontcolor("grey").bold() + fallback.small().fixed();
                break;
        }
        div.appendChild(input);
        document.getElementById("displayProperty").appendChild(div);
    } else {
        document.getElementById(feature.name).remove();
    }
}

function showCode(){
    if (document.getElementById("class").checked) {
        showCodeClass();
    } else {
        showCodeMethod();
    }
}

function showCodeMethod() {
    var input = document.getElementsByTagName("input");
    var i;
    var counter = 0;
    var sample = "//All resiliency features will only take effect for callRemoteService() ONLY".fontcolor("pink").bold() + br;
    var method = resilient_method;
    var classes = resilientClass;
    for (i=0; i< input.length; i++) {
        if (input[i].getAttribute("type") == "checkbox" && input[i].checked) {
            counter ++;
            switch (input[i].name) {
                case "CircuitBreaker":
                    method = comment_cb.fontcolor("grey").italics().fixed()
                        + br +  cbConfig.fixed().fontcolor("green").bold() + br + method;
                    break;
                case "Bulkhead":
                    method = comment_bh.fontcolor("grey").italics().fixed()
                        + br + bulkheadConfig.fixed().fontcolor("green").bold() + br + method;
                    break;
                case "Retry":
                    method = comment_retry.fontcolor("grey").italics().fixed()
                        + br + retryConfig.fixed().fontcolor("green").bold() + br + method;
                    break;
                case "RollingWindow":
                    classes = comment_rollingWindow.fontcolor("grey").italics().fixed()
                        + br + rollingWindowConfig.fixed().fontcolor("green").bold() + br + classes;
                    break;
                case "Cache":
                    method = comment_cache.fontcolor("grey").italics().fixed()
                        + br + cacheConfig.fixed().fontcolor("green").bold() + br + method;
                    break;
                case "Fallback":
                    classes = classes + br + comment_fallback.fontcolor("grey").italics().fixed()
                        + br + fallbackMethod.fixed().fontcolor("green").bold() + br + fallback;
                    break;
                default:
            }
        }
    }
    if (counter > 0) {
        sample = sample + br + classes.fixed() + br +  method.fixed() + br + br +
            another_method.fixed();
        sampleCode.innerHTML = sample;
    } else {
        sampleCode.innerHTML = "There is no resiliency feature selected!"
    }

}

function showCodeClass() {
    var input = document.getElementsByTagName("input");
    var i;
    var counter = 0;
    var sample = "//All resiliency features will take effect for all methods side ResilientClass".fontcolor("pink").bold() + br;
    var classes = resilientClass;
    for (i=0; i< input.length; i++) {
        if (input[i].getAttribute("type") == "checkbox" && input[i].checked) {
            counter ++;
            switch (input[i].name) {
                case "CircuitBreaker":
                    classes = comment_cb.fontcolor("grey").italics().fixed()
                        + br + cbConfig.fixed().fontcolor("green").bold() + br + classes;
                    break;
                case "Bulkhead":
                    classes = comment_bh.fontcolor("grey").italics().fixed()
                        + br + bulkheadConfig.fixed().fontcolor("green").bold() + br + classes;
                    break;
                case "Retry":
                    classes = comment_retry.fontcolor("grey").italics().fixed()
                        + br + retryConfig.fixed().fontcolor("green").bold() + br + classes;
                    break;
                case "RollingWindow":
                    classes = comment_rollingWindow.fontcolor("grey").italics().fixed()
                        + br + rollingWindowConfig.fixed().fontcolor("green").bold() + br + classes;
                    break;
                case "Cache":
                    classes = comment_cache.fontcolor("grey").italics().fixed()
                        + br + cacheConfig.fixed().fontcolor("green").bold() + br + classes;
                    break;
                case "Fallback":
                    classes = classes + br + comment_fallbackAll.fontcolor("grey").italics().fixed()
                        + br + fallbackAll.fixed().fontcolor("green").bold() + br + fallback;
                    break;
                default:
            }
        }
    }
    if (counter > 0) {
        sample = sample + br + classes.fixed() + br +  resilient_method.fixed() + br + br +
            another_method.fixed();
        sampleCode.innerHTML = sample;
    } else {
        sampleCode.innerHTML = "There is no resiliency feature selected!"
    }

}
