var br = "<br>";
var TAB = "&nbsp;&nbsp;";
var left = "&lt;";
var right = "&gt;";

var bh = "numConcurrentRequests=20, queueSize=5, strategy=BulkheadStrategy.WITH_QUEUE";
var rollingWindow = "numSlots=10, slotDuration=1, slotDurationUnit=TimeUnit.SECONDS";
var retry = "maxRetries=3, delayPeriod=1, delayPeriodUnit=TimeUnit.SECONDS, onExceptions=ConnectException.class";
var cb = "openCircuitErrorPercentage=60, sleepWindowDuration=5, sleepWindowDurationUnit=TimeUnit.SECONDS";
var cache = "useForFailure=true, timeToLive=30, timeToLiveUnit=TimeUnit.SECONDS";
var fallback = "public String myFallback(FallbackContext context) {" + br + "return \"This is the result of Fallback Function;\"" + br +"}" ;

var cbc = "CircuitBreaker Configuration: ";
var bhc = "Bulkhead Configuration: ";
var rollingWindowc = "RollingWindow Configuration: ";
var retryc = "Retry Configuration: ";
var cachec = "Cache Configuration: ";
var fallbackc = "Fallback method: ";


var provider = "ResiliencyProvider provider = new ResiliencyProviderImpl();";
var cacheConfig = "CacheConfig cacheConfig = provider" + br +
	".getCacheBuilder()" + br +
	".useOnFailure(true)" + br +
	".timeToLive(30, TimeUnit.SECONDS)" + br +
	".build();";
var cbConfig = "CircuitBreakerConfig circuitBreakerConfig = provider" + br +
    ".getCircuitBreakerBuilder()" + br +
    ".openCircuitErrorPercentage(60)" + br +
    ".sleepWindowDuration(5, TimeUnit.SECONDS)" + br +
    ".build();";
var rollingWindowConfig = "RollingWindowConfig rollingWindowConfig = provider.getRollingWindowConfigBuilder()"+ br +
	".numSlots(10)" + br +
	".slotDuration(1, TimeUnit.SECONDS)" + br +
	".build();";
var retryConfig = "RetryConfig retryConfig = provider.getRetryBuilder()" + br + "" +
	".maxRetries(3)" + br +
    ".delayPeriod(1, TimeUnit.SECONDS)" + br +
    ".addException(ConnectException.class)" + br +
    ".build();";
var bulkheadConfig = "BulkheadConfig bulkheadConfig = provider.getBulkheadBuilder()" + br +
    ".numConcurrentRequests(20)" + br +
	".queueSize(5)" + br +
	".strategy(BulkheadStrategy.WITH_QUEUE)" + br +
	".build();";
var resiliencyBuilder = "Resiliency resiliency = provider.getResiliencyBuilder()";
var with0 = ".with(";
var with1 = ")";
var build = ".build()";
var re_fallback = ".withFallback(ctx -> " + "\"This is the result of Fallback Function\"" +")";
var run_resiliency = "String result = resiliency";
var callable = ".runSync(() -> RemoteService.getResult());";

var async_fallback = ".withFallback(ctx -> {" + br +
	TAB + "ExecutorService executorService = Executors.newSingleThreadExecutor();" + br +
	TAB + "Future" + left + "String" + right + "future = executorService.submit(() -> \"This is the result of Fallback Function\");" + br +
	TAB + "executorService.shutdown();" + br +
	TAB + "return future;" + br + "})";
var async_resiliency = "Future" + left + "String" + right + " result = resiliency";
var async_callable = ".runAsync(() -> RemoteService.getResult());";

var arr = [];

var comment_provider = "//ResiliencyProvider is the entry point to get various Resiliency Feature builders";
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

var comment_rollingWindow = "//Resiliency instance with RollingWindow configured, it is used to calculate the statistics of Resiliency";

var comment_fallback = "//Resiliency::withFallback is the alternative result will be returned in case of any failure" + br +
	                   "//Please notice that the fallback method must have the same return type as callable." + br +
	                   "//withFallback takes the FallbackContext as parameter, from where you could get Exceptions thrown from callable.";

var comment_runSync = "//Resilieny::runSync takes a callable, therefore business logic is wrapped in a callable." + br +
		          "//runSync means it will execute the callable the way it is. If the callable returns a String," + br +
		          "//then Resiliency::runSync will also return a String. If the callable returns a Future" + left + "String" + right + br +
				  "//then Resiliency::runSync will also return a Future" + left + "String" + right;

var comment_runAsync = "//Resiliency::runAsync take a callable, and execute the callable in an Asynchronous fashion." + br +
		"//if callable returns a String, then Resiliency::runAsync will return a Future" + left + "String" + right + br +
		"//if callable returns a Future" + left + "String" + right + ", then Resiliency::runAsync will return Future" + left
	+ "Future" + left + "String" + right + right;



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
			default:
				div.innerHTML = "no Resiliency Feature";
		}
        div.appendChild(input);
		document.getElementById("displayProperty").appendChild(div);
	} else {
		document.getElementById(feature.name).remove();
	}
}

function showCode() {
    if (document.getElementById("async").checked) {
        showCodeAsync();
    } else {
        showCodeSync();
    }
}

function showCodeAsync() {
	var code = "Here should be the sample code";
	var input = document.getElementsByTagName("input");
	var i;
	var counter = 0;
	var sample = comment_provider.fontcolor("grey").italics().fixed() + br + provider.fixed() + br;
	var run = async_resiliency;
	var builder = resiliencyBuilder;
	arr = []; //clear array
	for (i=0; i< input.length; i++) {
		if (input[i].getAttribute("type") == "checkbox" && input[i].checked) {
			counter ++;
			switch (input[i].name) {
                case "CircuitBreaker":
                	sample = sample + br + comment_cb.fontcolor("grey").italics().fixed();
                    sample = sample + br + cbConfig.fixed() + br;
                    arr.push("circuitBreakerConfig");
                    break;
                case "Bulkhead":
                	sample = sample + br + comment_bh.fontcolor("grey").italics().fixed();
                    sample = sample + br + bulkheadConfig.fixed() + br;
                    arr.push("bulkheadConfig");
                    break;
                case "Retry":
                	sample = sample + br + comment_retry.fontcolor("grey").italics().fixed();
                    sample = sample + br + retryConfig.fixed() + br;
                    arr.push("retryConfig");
                    break;
                case "RollingWindow":
                	sample = sample + br + comment_rollingWindow.fontcolor("grey").italics().fixed();
                    sample = sample + br + rollingWindowConfig.fixed() + br;
                    arr.push("rollingWindowConfig");
                    break;
                case "Cache":
                	sample = sample + br + comment_cache.fontcolor("grey").italics().fixed();
                    sample = sample + br + cacheConfig.fixed() + br;
                    arr.push("cacheConfig");
                    break;
                case "Fallback":
                	run = comment_fallback.fontcolor("grey").italics().fixed()
						+ br + async_resiliency + async_fallback;
                    break;
                default:
			}
		}
	}
	if (counter > 0) {
		//first construct resiliency object:
		for (j=0; j<arr.length; j++) {
			builder = builder + with0 + arr[j] + with1 + br;
		}
		builder = builder.fixed() + build.fixed() + br;
		sample = sample + br + builder + br;

		//now run with resiliency
		run = comment_runAsync.fontcolor("grey").italics().fixed()
			+ br + run.fixed() + async_callable.fixed();

		sample = sample + br + run;
		sampleCode.innerHTML = sample;
	} else {
        sampleCode.innerHTML = "There is no resiliency feature selected!"
	}

}

function showCodeSync() {
    var code = "Here should be the sample code";
    var input = document.getElementsByTagName("input");
    var i;
    var counter = 0;
    var sample = comment_provider.fontcolor("grey").italics().fixed() + br + provider.fixed() + br;
    var run = run_resiliency;
    var builder = resiliencyBuilder;
    arr = []; //clear array
    for (i=0; i< input.length; i++) {
        if (input[i].getAttribute("type") == "checkbox" && input[i].checked) {
            counter ++;
            switch (input[i].name) {
                case "CircuitBreaker":
                    sample = sample + br + comment_cb.fontcolor("grey").italics().fixed();
                    sample = sample + br + cbConfig.fixed() + br;
                    arr.push("circuitBreakerConfig");
                    break;
                case "Bulkhead":
                    sample = sample + br + comment_bh.fontcolor("grey").italics().fixed();
                    sample = sample + br + bulkheadConfig.fixed() + br;
                    arr.push("bulkheadConfig");
                    break;
                case "Retry":
                    sample = sample + br + comment_retry.fontcolor("grey").italics().fixed();
                    sample = sample + br + retryConfig.fixed() + br;
                    arr.push("retryConfig");
                    break;
                case "RollingWindow":
                    sample = sample + br + comment_rollingWindow.fontcolor("grey").italics().fixed();
                    sample = sample + br + rollingWindowConfig.fixed() + br;
                    arr.push("rollingWindowConfig");
                    break;
                case "Cache":
                    sample = sample + br + comment_cache.fontcolor("grey").italics().fixed();
                    sample = sample + br + cacheConfig.fixed() + br;
                    arr.push("cacheConfig");
                    break;
                case "Fallback":
                    run = comment_fallback.fontcolor("grey").italics().fixed()
                        + br + run_resiliency + re_fallback;
                    break;
                default:
            }
        }
    }
    if (counter > 0) {
        //first construct resiliency object:
        for (j=0; j<arr.length; j++) {
            builder = builder + with0 + arr[j] + with1 + br;
        }
        builder = builder.fixed() + build.fixed() + br;
        sample = sample + br + builder + br;

        //now run with resiliency
        run = comment_runSync.fontcolor("grey").italics().fixed()
            + br + run.fixed() + callable.fixed();

        sample = sample + br + run;
        sampleCode.innerHTML = sample;
    } else {
        sampleCode.innerHTML = "There is no resiliency feature selected!"
    }

}

