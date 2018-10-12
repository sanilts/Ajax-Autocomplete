(document).ready(function () {
    initSuggestSearchField('nav#mainmenu .search', null);
    jQuery('.mp-menu .tx-solr input.fieldSearch').keydown(function (e) {
        if (e.keyCode == 13 && jQuery(this).val().length > 0) {
            jQuery(this).parent().submit();
        }
    });
});

function initSuggestSearchField(baseSelector, mode, callback) {
    var baseEl = jQuery(baseSelector);
    if (!baseEl.length)
        return;
    var searchfield = baseEl.find('.searchBox .inputText');
    var completedWord = baseEl.find('.searchBox .completedWord');
    var language = baseEl.find('.searchBox input[name*="L"]');
    callback = typeof callback !== 'undefined' ? callback : function (ul, item) {
        var title = '<div class="itemContent type-' + item.type + '"><div class="item-title">' + item.title + '</div><div class="item-type">' + item.typeLabel + '</div></div>';
        var itemUri = '/' + item.uri;
        itemUri = itemUri.replace("//", "/");
        return $("<li>").append('<a class="resultLink" href="' + itemUri + '">' + title + '</a>').appendTo(ul);
    };
    if (searchfield.length > 0) {
        searchfield.autocomplete({
            source: function (request, response) {
                jQuery(this).get(0).element.addClass('search-processing');
                $.ajax({
                    url: window.location.origin,
                    dataType: "json",
                    data: {'eID': 'wproducts_suggest', 'a': {'l': request.term}, 'lang': language.val(), 'mode': mode},
                    error: function (result) {
                    },
                    success: function (data) {
                        if (data.docs) {
                            response($.map(data.docs, function (item) {
                                return {
                                    uid: item.uid,
                                    title: item.title,
                                    subtitle: item.subtitle,
                                    typeLabel: item.typeLabel,
                                    type: item.type,
                                    image: item.image,
                                    uri: item.uri
                                }
                            }));
                        }
                        jQuery(".fieldSearch").removeClass('search-processing');
                    }
                });
            }, minLength: 2, appendTo: baseSelector, select: function (event, ui) {
                completedWord.val('');
                searchfield.val('');
                $('.search').removeClass('active');
                jQuery(".fieldSearch").addClass('search-processing');
            }, open: function () {
            }, close: function () {
            }
        }).data("ui-autocomplete")._renderItem = callback;
        searchfield.keydown(function (e) {
            if (e.keyCode == 8 && searchfield.val().length <= 1) {
                completedWord.val('');
            }
            if (e.keyCode == 9 && completedWord.val().length > 0) {
                searchfield.val(completedWord.val());
                return false;
            }
            if (e.keyCode == 13 && searchfield.val().length > 0) {
                searchfield.val(searchfield.val());
            }
            switch (e.keyCode) {
                case 9:
                    break;
            }
        });
    }
    searchfield.keyup(function () {
        if (searchfield.val().length == 0) {
            completedWord.val('');
        }
    });
    searchfield.change(function () {
        if (searchfield.val().length == 0) {
            completedWord.val('');
        }
    });
}