var br = "<br>";
var TAB = "&nbsp;&nbsp;";
var left = "&lt;";
var right = "&gt;";

var configsource0 = "ConfigSource = {";
var configsource1 = TAB + "pollingInterval = 2" + br
                    + "}";
var comment_polling ="#OPTIONAL: This integer value specifies how often in SECONDS "
    + "should we check if the configuration stored in the config source has been changed. " +
    "If this property is not sepecified, configuration change cannot take effect dynamically. " +
    "By default, pollingInterval = -1, which means dynamic change is disabled";

var etcd_type = TAB + "type = etcd" + br;
var etcd_uri = TAB + "uri = \"http://localhost:2379\"" + br;
var etcd_key = TAB + "key = \"resiliency/demo\"" + br;
var etcd_version = TAB + "version = 3" + br;

var comment_etcd0 = "#type specifies the configuration is stored in etcd {@link http://mic-api.uk.oracle.com/config/io/j4c/config/etcd/EtcdConfigSource.Builder.html }";
var comment_etcd1 = "#uri is required by io.j4c.config:j4c-config api to connect to the etcd";
var comment_etcd2 = "#key is required by io.j4c.config:j4c-config api to retrieve the configuration";
var comment_etcd3 = "#etcd API version is required by io.j4c.config:j4c-config api, currently supporting 2 and 3";

var file_type = TAB + "type = classpath" + br;
var file_resource = TAB + "resourceName = \"application.conf\"" + br;

var comment_file0 = "#type specifies the configuartion is stored in a file available on classpath {@link http://mic-api.uk.oracle.com/config/index.html?jdk/config/etcd/EtcdConfigSource.Builder.html }"
var comment_file1 = "#resourceName is required by io.j4c.config:j4c-config api (it is called \"file\" in their api) to retrieve the configuration from specified file";

var url_type = TAB + "type = url" + br;
var url_url = TAB + "url = \"http://localhost:8080/application.conf\"" + br;

var comment_url0 = "#type specifies the configuration is read from url {@link http://mic-api.uk.oracle.com/config/index.html?jdk/config/etcd/EtcdConfigSource.Builder.html }"
var comment_url1 = "#url is required by io.j4c.config:j4c-config api to retrieve the configuration from this endpoint URL";

var configmap_type = TAB + "type = configmap" + br;
var configmap_mountPath = TAB + "mountPath = \"/etc/config\"" + br;
var configmap_key = TAB + "key = \"resiliency\"" + br;

var comment_configmap0 = "#type sepcifies the configuration is read from Kubernetes ConfigMap"
var comment_configmap1 = "#mountPath is the same mountPath specified in the kubernetes deployment yaml file"
var comment_configmap2 = "#key is the ConfigMap's key, which maps to the corresponding configuration content"


function showFile () {
    var isEtcd = document.getElementById("etcd");
    var isFile = document.getElementById("file");
    var isUrl = document.getElementById("url");
    var isConfigMap = document.getElementById("configmap");
    var javadoc;
    var output = configsource0.fixed();

    if (isEtcd.checked) {
        javadoc = comment_etcd0.replace(/(http:\/\/[^\s]+)/gi , '<a href="$1">$1</a>');
        output = configsource0.fixed() + br + javadoc.fontcolor("grey").italics().fixed() + br +
        etcd_type.fixed() + br + comment_etcd1.fontcolor("grey").italics().fixed() + br +
        etcd_uri.fixed() + br + comment_etcd2.fontcolor("grey").italics().fixed() + br +
        etcd_key.fixed() + br + comment_etcd3.fontcolor("grey").italics().fixed() + br +
        etcd_version.fixed() + br + comment_polling.fontcolor("grey").italics().fixed() + br + configsource1.fixed();
        sampleCode.innerHTML = output;
    } else if (isFile.checked) {
        javadoc = comment_file0.replace(/(http:\/\/[^\s]+)/gi , '<a href="$1">$1</a>');
        output = configsource0.fixed() + br + javadoc.fontcolor("grey").italics().fixed() + br +
        file_type.fixed() + br + comment_file1.fontcolor("grey").italics().fixed() + br +
        file_resource.fixed() + br + br +
        comment_polling.fontcolor("grey").italics().fixed() + br + configsource1.fixed();

        sampleCode.innerHTML = output;
    } else if (isUrl.checked) {
        javadoc = comment_url0.replace(/(http:\/\/[^\s]+)/gi , '<a href="$1">$1</a>');
        output = configsource0.fixed() + br + javadoc.fontcolor("grey").italics().fixed() + br +
            url_type.fixed() + comment_url1.fontcolor("grey").italics().fixed() + br +
            url_url.fixed() + br + br +
            comment_polling.fontcolor("grey").italics().fixed() + br + configsource1.fixed();

        sampleCode.innerHTML = output;
    } else if (isConfigMap.checked) {
        output = configsource0.fixed() + br + comment_configmap0.fontcolor("grey").italics().fixed() + br +
                configmap_type.fixed() + br + comment_configmap1.fontcolor("grey").italics().fixed() + br +
                configmap_mountPath.fixed() + br + comment_configmap2.fontcolor("grey").italics().fixed() + br +
                configmap_key.fixed() + br + br +
                comment_polling.fontcolor("grey").italics().fixed() + br + configsource1.fixed();

        sampleCode.innerHTML = output;
    } else {
        sampleCode.innerHTML = br + "There is no Config Source selected!".fontcolor("orange")
    }
}