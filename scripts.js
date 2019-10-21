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

Promise.all([grabCompanies(), grabProducts(), grabOfferings()])
    .then(responses => {
        console.log(responses);
        const {companies, products, offerings} = {companies: responses[0], products: responses[1], offerings: responses[2]}
        const findProductsInPriceRange = (products, {min, max}) => {
            return products.filter((item) => {
                return item.suggestedPrice >= min && item.suggestedPrice <= max
            })
        };

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
        
        const processOfferings = (companies, products, offerings) => {
            return offerings.map(offering => {
                return { offering: offering.id, productId: products.find(product => product.id === offering.productId).id, companyId: companies.find(company => company.id === offering.companyId).id}
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

            return (filtered.length ? companies.find(company => company.id === filtered[0]).name : 'No companies offer that many products')
        };
        
        const processProducts = (products, offerings) => {
            const count = offerings.reduce((accum, currentOff) => {
                if(currentOff.productId in accum) {
                    accum[currentOff.productId].amount++
                    accum[currentOff.productId].total += currentOff.price         
                } else {
                    accum[currentOff.productId] = {amount: 1, total: currentOff.price};
                }
                return accum;
            }, {});

            return Object.entries(count).map(item => {
                console.log(item);
                return { product: products.find(product => product.id === item[0]).id, averagePrice: (item[1].total / item[1].amount)}
            });
        };
        
    const productsInPriceRange = findProductsInPriceRange(products, {min: 1, max: 15});        
    console.log(productsInPriceRange);

    const groupedCompaniesByLetter = groupCompaniesByLetter(companies);        
    console.log(groupedCompaniesByLetter);

    const groupedCompaniesByState = groupCompaniesByState(companies);        
    console.log(groupedCompaniesByState);

    const processedOfferings = processOfferings(companies, products, offerings);        
    console.log(processedOfferings);

    const threeOrMoreOfferings = companiesByNumberOfOfferings(companies, offerings, 3);        
    console.log(threeOrMoreOfferings);

    const processedProducts = processProducts(products, offerings);        
    console.log(processedProducts);

    })

    .catch(e => console.log(e));



