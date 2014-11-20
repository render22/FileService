/**
 * This methods use in handlebars view-helper module
 * @type {{
 * formatDate: Function,
  * isCurrentPage: Function
  * }}
 */
module.exports = {
    formatDate: function (inputDate) {
        var date = new Date(inputDate);

        return '' + date.getFullYear()
        + '-' + (((date.getMonth() + 1) > 10) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1)))
        + '-' + ((date.getDate() > 10) ? date.getDate() : ('0' + date.getDate()))
        + ' ' + ((date.getHours() > 10) ? date.getHours() : ('0' + date.getHours()))
        + ':' + ((date.getMinutes() > 10) ? date.getMinutes() : ('0' + date.getMinutes()))
        + ':' + ((date.getSeconds() > 10) ? date.getSeconds() : ('0' + date.getSeconds()));

    },

    isCurrentPage: function (comparePage) {

        if (comparePage[0] == comparePage[1])
            return 'active';
        else
            return '';
    }
}
