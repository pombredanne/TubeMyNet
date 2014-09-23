;(function(undefined) {

  /**
   * TubeMyNet Narratives Pane
   * ==========================
   *
   * This pane enables the user to compose narratives around his/her graph.
   */

  app.panes.narratives = function() {
    var self = this,
        $beforeMain = $('.before-main'),
        s = app.control.get('mainSigma');

    // Extending
    Pane.call(this,  {
      name: 'narratives'
    });

    // State
    this.thumbnails = [];
    this.mode = null;

    // Emitters
    this.menuEmitters = function(dom) {

      /**
       * Adding a new narrative.
       */
      dom.on('click', '[data-app-narratives-action="add"]', function()  {
        self.dispatchEvent('narrative.add');
      });

      /**
       * Editing an existing narrative.
       */
      dom.on('click', '[data-app-narratives-action="edit"]', function()  {
        var nid = $(this).attr('data-app-narrative-id');

        self.dispatchEvent('narrative.select', nid);
        edition(app.control.query('narrativeById', nid));
      });
    };

    this.editionEmitters = function(dom) {

      /**
       * Going back to the menu
       */
      dom.on('click', '[data-app-narratives-action="back"]', function()  {
        self.dispatchEvent('narrative.back');
        menu();
      });

      /**
       * Edit one of the possible fields
       */
      dom.on('change', '[data-app-narratives-editable]', function() {
        var prop = $(this).attr('data-app-narratives-editable'),
            val = $(this).val().trim();

        if (prop === 'title') {
          self.dispatchEvent('narrative.edit', {title: val});
        }
        else if (prop === 'slide_title') {

        }
        else if (prop === 'slide_text') {

        }
      });
    };

    // Rendering possibilities
    function menu() {
      self.mode = 'menu';
      self.unmountThumbnails();

      // Templating
      app.templates.require(
        'narratives.menu',
        function(template) {
          var $newDom = $(template());

          $beforeMain.next('div').replaceWith($newDom);
          self.renderNarrativeList();
          self.menuEmitters($newDom);
        }
      );
    }

    function edition(narrative) {
      self.mode = 'edition';

      // Templating
      app.templates.require('narratives.edit', function(template) {
        var $newDom = $(template(narrative || {}));
        $beforeMain.next('div').replaceWith($newDom);

        self.renderSnapshots();
        self.editionEmitters($newDom);
      });
    }

    // Methods
    this.renderNarrativeList = function() {
      app.templates.require(
        ['narratives.item', 'narratives.addItem'],
        function(templates) {
          var item = templates['narratives.item'],
              controls = templates['narratives.addItem'];

          // Templating the menu items
          var $list = $('.narratives-list');

          app.control.get('narratives').forEach(function(narrative) {
            $list.append(item(narrative));
          });

          // Adding the controls
          $list.append(controls());
        }
      );
    };

    this.renderSnapshots = function() {

    };

    this.refreshThumbnails = function() {
      s.refresh();
      this.thumbnails.forEach(function(t) {
        t.render();
      });
    };

    this.unmountThumbnails = function() {
      this.thumbnails.forEach(function(t) {
        t.unmount();
      });

      this.thumbnails = [];
    };

    // Receptors
    this.triggers.events['narrative.added'] = function(d, e) {
      if (self.mode !== 'menu')
        return;

      edition(e.data);
    };

    // Initialization
    this.didRender = function() {
      var currentNarrative = app.control.get('currentNarrative');

      if (currentNarrative)
        edition(app.control.query('narrativeById', currentNarrative));
      else
        menu();
    };
  };
}).call(this);
