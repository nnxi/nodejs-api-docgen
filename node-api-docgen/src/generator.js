const generateDocs = (apiList) => {
    console.log('\n-------- Api List --------\n');
    console.table(apiList);
};

module.exports = {
    generateDocs,
};