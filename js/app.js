var Projekt = Backbone.Model.extend({
  defaults: {
    name: 'Neues Projekt',
    laenge: 0
  },
  initialize: function() {
    new ListView({
      eintrag: this.get("name") + ", Länge " + this.get("laenge")
    });
    this.on("change:laenge", function(model) {
      new ListView({
        eintrag: 'Länge geändert: ' + model.get("laenge")
      });
    });
  },
  url: "save"
});

var Projekte = Backbone.Collection.extend({
  model: Projekt
});
var projekte = new Projekte;

var id = 0;
var EingabeView = Backbone.View.extend({
  initialize: function() {
    this.rendern();
  },
  rendern: function() {
    var tpl = _.template($("#eingabe").html(), {"nr": ++id});
    this.$el.html(tpl);
  },
  events: {
    "click input[type=button]": "speichern"
  },
  speichern: function() {
    var projekt = new Projekt({
      name: $('#projektname').val()
    });
    projekt.set({laenge: 20000});
    projekt.save({'id': id}, {
      success: function(projekt) {
        new ListlinkView({
          url: '#/projekt/' + projekt.get('id'),
          eintragLink: projekt.get('name'),
          eintrag: ' gespeichert'
        });
      },
      error: function(projekt) {
        // script answers with an error when saving
        // because it cannot find the URL "save"
        // (which would have to answer with JSON data)
        new ListlinkView({
          url: '#/projekt/' + projekt.get('id'),
          eintragLink: projekt.get('name'),
          eintrag: ' nicht gespeichert'
        });
      }
    });
    projekte.add([projekt]);
    this.rendern();
  }
});
new EingabeView({
  el: $("#eingabe_container")
});

var ListView = Backbone.View.extend({
  initialize: function() {
    var tpl = _.template($('#liste').html(), {
      eintrag: this.options.eintrag
    });
    $("#info").append(tpl);
  }
});

var ListlinkView = Backbone.View.extend({
  initialize: function() {
    var tpl = _.template($('#liste_link').html(), {
      url: this.options.url,
      eintragLink: this.options.eintragLink,
      eintrag: this.options.eintrag
    });
    $("#info").append(tpl);
  }
});

var AppRouter = Backbone.Router.extend({
  routes: {
    "projekt/:id": "getProjekt",
    "*actions": "defaultRoute"
  }
});
var app_router = new AppRouter;
app_router.on('route:getProjekt', function(id) {
  if (!projekte.length) return;
  var projekt = projekte.get(id);
  if (projekt) alert("Projekt " + id + ": " + projekt.get("name"));
});
Backbone.history.start();
