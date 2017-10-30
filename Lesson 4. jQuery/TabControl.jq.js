(function bindInScope($) {
    $(function () {
      var container = $('.tabsControl');
      var headers = $(container).children('ul').addClass('tab-headers');
      var contents = $('<ul/>').addClass('tab-contents').appendTo($(container));

      var id = 1;
      var items = $(headers).children('li');
      $(items).each((index, item) => {
        var headerId = 'tab-header-' + id;
        var contentId = 'tab-content-' + id;
        var header = $(item).children('h2')
          .attr('id', headerId)
          .attr('data-content-id', contentId);

        $(item).click((event) => {
          var activeHeaderItem = $(item).siblings('.active');
          if($(activeHeaderItem).is($(item))) return;

          $(activeHeaderItem).removeClass('active');
          $(item).addClass('active');
          var contentId = $(item).children('h2').attr('data-content-id');
          
          var content = $('#'+contentId);
          var contentItem = $(content).parent();
          var activeContentItem = $(contentItem).siblings('.active');
          $(activeContentItem).removeClass('active');
          $(contentItem).addClass('active');
        });

        var content = $(item).children('div').attr('id', 'tab-content-' + id);
        $(content).appendTo($('<li>').appendTo($(contents)));
        id++;
      });

      $(headers).children('li:first-child').addClass('active');
      $(contents).children('li:first-child').addClass('active');

      $(headers).append($('<li/>').addClass('filler'));
    });
}(jQuery));