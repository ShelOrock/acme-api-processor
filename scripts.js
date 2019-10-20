const grabCompanies = () => new Promise((res, rej) => {
    return window.fetch('https://acme-users-api-rev.herokuapp.com/api/companies')
            .then(response => response.json())
            .then(jsonData => {
                res(jsonData)
            }) 
            .catch(e => rej(e));
});

const grabProducts = () => new Promise((res, rej) => {
    return window.fetch('https://acme-users-api-rev.herokuapp.com/api/products')
            .then(response => response.json())
            .then(jsonData => {
                res(jsonData)
            })
            .catch(e => rej(e));
});
 
const grabOfferings = () => new Promise((res, rej) => {
    return window.fetch('https://acme-users-api-rev.herokuapp.com/api/offerings')
            .then(response => response.json())
            .then(jsonData => {
                res(jsonData)
            })
            .catch(e => rej(e));
});


const findProductsInPriceRange = (products, {min, max}) => {
    return products.filter((item) => {
        return item.suggestedPrice >= min && item.suggestedPrice <= max
    })
}

const groupCompaniesByLetter = (companies) => {
    return companies.reduce((accum, currCompany) => {
        if(currCompany.name[0] in accum) {
            accum[currCompany.name[0]].push(currCompany.name);
        } else {
            accum[currCompany.name[0]] = [currCompany.name]
        }
        return accum;
    }, {});
};

const groupCompaniesByState = (companies) => {
    return companies.reduce((accum, currCompany) => {
        if(currCompany.state in accum) {
            accum[currCompany.state].push(currCompany.name);
        } else {
            accum[currCompany.state] = [currCompany.name];
        }
        return accum;
    }, {});
};

const processedOfferings = (companies, products, offerings) => {
    return offerings.map(offering => {
        return { offering: offering.id, productId: products.find(id => id === offering.productId), companyId: companies.find(id => id === offering.companyId)}
    });
};

const companiesByNumberOfOfferings = (companies, offerings, n) => {
    const count = offerings.reduce((accum, currentOff) => {
        if(currentOff.companyId in accum) {
            accum[currentOff.companyId]++;
        } else {
            accum[currentOff.companyId] = 1;
        }
        return accum;
    }, {});

    const filtered = Object.entries(count).filter(item => {
        return item[1] > n;
    });

    return companies.find(id => id === filtered[0]);
}

const processProducts = (products, offerings) => {
    const count = offerings.reduce((accum, currentOff) => {
        if(currentOff.productId in accum) {
            accum[currentOff.productId[total]] += currentOff.price;
            accum[currentOff.productId[count]]++;
        } else {
            accum[currentOff.productId[total]] = currentOff.price;
            accum[currentOff.productId[count]] = 1;
        }
        return accum;
    }, {});

    return Object.entries(count).map(item => {
        return { product: products.find(id === item.productId), averagePrice: (item.productId.total / item.productId.count)}
    });
}

grabProducts();
grabCompanies();
grabOfferings();

