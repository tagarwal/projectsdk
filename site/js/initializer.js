(function () {

    Versions = function () {
    };

    var strict_range = /\[(.*),(.*)\]/;
    var halfopen_right_range = /\[(.*),(.*)\)/;
    var halfopen_left_range = /\((.*),(.*)\]/;
    var qualifiers = ['M', 'RC', 'BUILD-SNAPSHOT', 'RELEASE'];

    Versions.prototype.matchRange = function (range) {
        var strict_match = range.match(strict_range);
        if (strict_match) {
            return function (version) {
                return compareVersions(strict_match[1], version) <= 0
                    && compareVersions(strict_match[2], version) >= 0;
            }
        }
        var hor_match = range.match(halfopen_right_range);
        if (hor_match) {
            return function (version) {
                return compareVersions(hor_match[1], version) <= 0
                    && compareVersions(hor_match[2], version) > 0;
            }
        }
        var hol_match = range.match(halfopen_left_range);
        if (hol_match) {
            return function (version) {
                return compareVersions(hol_match[1], version) < 0
                    && compareVersions(hol_match[2], version) >= 0;
            }
        }

        return function (version) {
            return compareVersions(range, version) <= 0;
        }
    };

    function parseQualifier(version) {
        var qual = version.replace(/\d+/g, "");
        return qualifiers.indexOf(qual) != -1 ? qual : "RELEASE";
    }

    function compareVersions(a, b) {
        var result;

        var versionA = a.split(".");
        var versionB = b.split(".");
        for (var i = 0; i < 3; i++) {
            result = parseInt(versionA[i], 10) - parseInt(versionB[i], 10);
            if (result != 0) {
                return result;
            }
        }
        var aqual = parseQualifier(versionA[3]);
        var bqual = parseQualifier(versionB[3]);
        result = qualifiers.indexOf(aqual) - qualifiers.indexOf(bqual);
        if (result != 0) {
            return result;
        }
        return versionA[3].localeCompare(versionB[3]);
    }

    /**
     * Parse hash bang parameters from a URL as key value object.
     * For repeated parameters the last parameter is effective.
     * If = syntax is not used the value is set to null.
     * #!x&y=3 -> { x:null, y:3 }
     * @param url URL to parse or null if window.location is used
     * @return Object of key -> value mappings.
     * @source https://gist.github.com/zaus/5201739
     */
    hashbang = function (url, i, hash) {
        url = url || window.location.href;

        var pos = url.indexOf('#!');
        if( pos < 0 ) return [];
        var vars = [], hashes = url.slice(pos + 2).split('&');

        for(i = hashes.length; i--;) {
            hash = hashes[i].split('=');

            vars.push({ name: hash[0], value: hash.length > 1 ? hash[1] : null});
        }

        return vars;
    }

    applyParams = function() {
        var params = hashbang();
        $.each(params, function( index, param ) {
            var value = decodeURIComponent(param.value);
            switch(param.name)  {
                case 'type':
                case 'packaging':
                case 'javaVersion':
                case 'language':
                    $('.' + param.name.toLowerCase() + '-form-group').removeClass("hidden");
                    $('#' + param.name+ ' option[value="' + value + '"]').prop('selected', true);
                    $('#' + param.name).change();
                    break;
                case 'groupId':
                case 'artifactId':
                case 'name':
                case 'description':
                case 'packageName':
                    $('.' + param.name.toLowerCase() + '-form-group').removeClass("hidden");
                    $('#' + param.name).val(value);
                    $('#' + param.name).change();
                    break;
            }
        });
    }

}());

function generate_project() {
    $("#form").submit();
    $("#divLoad").removeClass('hidden');
    setTimeout(function(){
        $("#divLoad").addClass('hidden');
    }, 6000);
    return false;
}

$(function () {
    // holder for list of components already selected
    var selectedComponents = [];
    console.log(selectedComponents);

    var initializeVersions = function () {
        $.getJSON("rest/versions", function (data) {
            var versions = data.versions;
            $.each(versions, function (i, item) {
                $('#datasetVersion').append($('<option>', {
                    value: item.version,
                    text : item.version
                }));
            });
            $("#datasetVersion").val(versions[versions.length-1].version);
        });
    };

    var initializeSearchEngine = function (engine, datasetVersion) {
        $.getJSON("rest/components?datasetVersion="+datasetVersion, function (data) {
            engine.clear();
            removeAllChildNodes("starters");
            $.each(data.components, function(idx, item) {
                if(item.weight === undefined) {
                    item.weight = 0;
                }
            });
            engine.add(data.components);
        });
    };

    var initializeComponents = function (categoryName) {
        $.getJSON("rest/categories/"+categoryName+"/components", function (data) {
            var comps = data.components;
            for(var i = 0; i < comps.length; i++) {
                var outerdiv = document.createElement("div");
                outerdiv.className = "checkbox";
                outerdiv.setAttribute("data-range", "");

                var innerlabel = document.createElement("label");
                var checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.name = "style";
                checkbox.id = compactString(comps[i].name);
                checkbox.tabIndex = "13";
                checkbox.value = comps[i].id;

                checkbox.onclick = function () {
                    var value = $(this).val()
                    if ($(this).prop('checked')) {
                        var results = starters.get(value);
                        addTag(results[0].id, results[0].name);
                    } else {
                        removeTag(value);
                    }
                };

                var para = document.createElement("P");
                var t = document.createTextNode(comps[i].description);
                para.appendChild(t);

                innerlabel.appendChild(checkbox);
                innerlabel.appendChild(document.createTextNode(comps[i].name));
                innerlabel.appendChild(para);
                outerdiv.appendChild(innerlabel);

                if ( i % 2 == 0) $("#" + "dependencies-" + compactString(categoryName) + "-01").append(outerdiv);
                else $("#" + "dependencies-" + compactString(categoryName) + "-02").append(outerdiv);
            }
        });
    };

    var initializeCategoriesAndComponents = function (datasetVersion) {
        removeAllChildNodes("category-list");
        $.getJSON("rest/categories?datasetVersion="+datasetVersion, function (data) {
            var categories = data.categories;

            for (var i = 0; i < categories.length; i++) {
                var nameCompact = compactString(categories[i].name);
                var componentListElement =
                    '<div class="panel-heading">'+
                    '<h4 class="panel-title"> <b>'+ categories[i].name +
                    '</b></h4>'+'<div class="gradient_line"></div>' +
                    '</div>'+
                    '<div id="dependencies'+ i +'">'+
                    '<div class="panel-body">'+
                    '<div class="row">'+
                    '<div class="col-01 col-sm-12 col-md-6">'+
                    '<div id="dependencies-' + nameCompact + '-01"></div>'+
                    '</div>'+
                    '<div class="col-02 col-sm-12 col-md-6">'+
                    '<div id="dependencies-' + nameCompact + '-02"></div>'+
                    '</div>'+
                    '</div>'+
                    '</div>'+
                    '</div>';

                $("#category-list").append(componentListElement);
                initializeComponents(categories[i].name);
            }
        });
    };

    var invalidateComponents = function(compName) {
        if (selectedComponents.length > 0) {
            $.getJSON("rest/exclusionset?component="+compName, function (data) {
                var violatedComps = data.components;
                for(var i = 0; i < violatedComps.length; i++) {
                    $('#' + compactString(violatedComps[i].name)).attr('disabled', 'disabled');
                    // TODO remove from starter
                }
            });
        }
    };

    var refreshDependencies = function (versionRange) {
        var versions = new Versions();
        $("#dependencies div.checkbox").each(function (idx, item) {
            if (!$(item).attr('data-range') || versions.matchRange($(item).attr('data-range'))(versionRange)) {
                $("input", item).removeAttr("disabled");
                $(item).removeClass("disabled has-error");
            } else {
                $("input", item).prop('checked', false);
                $(item).addClass("disabled has-error");
                $("input", item).attr("disabled", true);
                removeTag($("input", item).val());
            }
        });
    };

    var compactString = function (name) {
        return name.replace(" ", "");
    };
    var addTag = function (id, name) {
        if ($("#starters div[data-id='" + id + "']").length == 0) {
            $("#starters").append("<div class='tag' data-id='" + id + "'>" + name +
                "<button type='button' class='close' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>");

            // add to the array of selected components
            selectedComponents.push(name);

            // invalidate components from same Exclusion Set
            invalidateComponents(name);
            console.log("Added compoenent: " + name + "; Components Selected : " + selectedComponents);
        }
    };
    var removeTag = function (id) {
        $("#starters div[data-id='" + id + "']").remove();
        // remove from array
        var index = selectedComponents.indexOf(id);
        if (index > -1) {
            selectedComponents.splice(index, 1);
            console.log("Removed compoenent: " + id + "; Components Selected : " + selectedComponents);
        }
    };

    var removeAllChildNodes = function (element) {
        var myNode = document.getElementById(element);
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
    };

    // refreshDependencies($("#datasetVersion").val());
    $("#type").on('change', function () {
        $("#form").attr('action', $(this.options[this.selectedIndex]).attr('data-action'))
    });
    $("#datasetVersion").on("change", function (e) {
        // refreshDependencies(this.value);
        initializeSearchEngine(starters, this.value);
        initializeCategoriesAndComponents(this.value);
    });
    $(".tofullversion a").on("click", function() {
        $(".full").removeClass("hidden");
        $(".tofullversion").addClass("hidden");
        $(".tosimpleversion").removeClass("hidden");
        $("body").scrollTop(0);
        return false;
    });
    $(".tosimpleversion a").on("click", function() {
        $(".full").addClass("hidden");
        $(".tofullversion").removeClass("hidden");
        $(".tosimpleversion").addClass("hidden");
        applyParams();
        $("body").scrollTop(0);
        return false;
    });
    var maxSuggestions = 5;
    var starters = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.nonword('id', 'name', 'description', 'group'),
        queryTokenizer: Bloodhound.tokenizers.nonword,
        identify: function (obj) {
            return obj.id;
        },
        sorter: function(a,b) {
            return b.weight - a.weight;
        },
        limit: maxSuggestions,
        cache: false
    });

    initializeVersions();
    // Load latest version of dataSet for the very first time
    initializeSearchEngine(starters, "");
    initializeCategoriesAndComponents("");

    $('#autocomplete').typeahead(
        {
            minLength: 2,
            autoSelect: true
        }, {
            name: 'starters',
            display: 'name',
            source: starters,
            templates: {
                suggestion: function (data) {
                    return "<div><strong>" + data.name + "</strong><br/><small>" + data.description + "</small></div>";
                },
                footer: function(search) {
                    if (search.suggestions && search.suggestions.length == maxSuggestions) {
                        return "<div class=\"tt-footer\">More matches, please refine your search</div>";
                    }
                    else {
                        return "";
                    }
                }
            }
        });
    $('#autocomplete').bind('typeahead:select', function (ev, suggestion) {
        var alreadySelected = $("#dependencies input[value='" + suggestion.id + "']").prop('checked');
        if(alreadySelected) {
            removeTag(suggestion.name);
            $("#dependencies input[value='" + suggestion.id + "']").prop('checked', false);
        }
        else {
            addTag(suggestion.id, suggestion.name);
            $("#dependencies input[value='" + suggestion.id + "']").prop('checked', true);
        }
        $('#autocomplete').typeahead('val', '');
    });
    $("#starters").on("click", "button", function () {
        var id = $(this).parent().attr("data-id");
        $("#dependencies input[value='" + id + "']").prop('checked', false);
        removeTag(id);
    });
    $("#dependencies input").bind("change", function () {
        var value = $(this).val()
        if ($(this).prop('checked')) {
            var results = starters.get(value);
            addTag(results[0].id, results[0].name);
        } else {
            removeTag(value);
        }
    });
    var autocompleteTrap = new Mousetrap($("#autocomplete").get(0));
    autocompleteTrap.bind("enter", function(e) {
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
    });

    applyParams();
    if ("onhashchange" in window) {
        window.onhashchange = function() {
            $(".full").addClass("hidden");
            $(".tofullversion").removeClass("hidden");
            $(".tosimpleversion").addClass("hidden");
            applyParams();
        }
    }
});
