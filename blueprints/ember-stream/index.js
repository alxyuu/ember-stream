module.exports = {
    afterInstall: function() {
        return this.addBowerPackagesToProject([
            {
                name: 'rxjs',
                target: '~2.5.2'
            }
        ]);
    },

    normalizeEntityName: function() {}
};
