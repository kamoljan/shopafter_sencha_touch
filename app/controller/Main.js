Ext.define('ShopAfter.controller.Main', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            main: 'main',
            adsList: 'adssearch > list',
            searchField: 'adssearch > toolbar > formpanel > searchfield'
        },
        control: {
            searchField: {
                action: 'onSearch'
            },
            'adslistview > toolbar > button': {
                tap: function () {
                    Ext.Viewport.toggleMenu("left");
                }
            },
            'adinsert > toolbar > button': {
                tap: function () {
                    Ext.Viewport.toggleMenu("left");
                }
            },
            'menu > button': {
                tap: function (btn) {
                    var newActiveItem = Ext.ComponentQuery.query("adslistview[menu=" + btn.getMenu() + "]");
                    var main = this.getMain();
                    newActiveItem = newActiveItem.length > 0 ? newActiveItem[0] : null;
                    if (newActiveItem) {
                        main.setActiveItem(newActiveItem);
                        Ext.Viewport.hideAllMenus();
                        Ext.Viewport.getTranslatable().on('animationend', function () {
                            var list = newActiveItem.down("list"),
                                store;
                            if (list) {
                                store = list.getStore();
                                if (!store.isLoaded()) {
                                    store.load();
                                }
                            }
                        }, this, {single: true});
                    }
                }
            }
        }
    },

    onSearch: function () {
        var searchField = this.getSearchField();
        this.fireAction('search', [searchField.getValue()], 'doSearch');
    },

    doSearch: function (search) {
        search = search.replace(/^\s+|\s+$/g, '');
        if (search.length <= 0) {
            return;
        }
        var adsList = this.getAdsList(),
            adsStore = adsList.getStore();
        adsStore.currentPage = 1;
        adsStore.filter('query', search);
        adsList.setScrollToTopOnRefresh(true);
        adsStore.load();
    }
});
