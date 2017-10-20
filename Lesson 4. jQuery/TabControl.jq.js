(function bindInScope($) {
    $(function () {
      $('#tabControlContainer')
        .append(
          $('<ul/>').addClass('tabs')
            .append($('<li/>')
              .append($('<span/>').addClass('tab-header').html('Таб1'))
              .append($('<div/>').addClass('tab-content').html('Таб1 Содержимое'))
            )
            .append($('<li/>')
              .append($('<span/>').addClass('tab-header').html('Таб2'))
              .append($('<div/>').addClass('tab-content').html('Таб2 Содержимое'))
            )
        )
    });
}(jQuery));