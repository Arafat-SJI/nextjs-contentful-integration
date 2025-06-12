export const getSeoData = (pageData: any) => {
    const seoData = pageData?.fields?.seoConfiguration;
    const additionalMetaTags = seoData?.fields?.additionalMetaTags;
    const data = additionalMetaTags?.reduce((acc: any, item: any) => {
        acc[item.fields.property] = item?.fields?.content;
        return acc;
    }, {});

    console.log(data);
    return {
        title: seoData?.fields?.titleMetaTag,
        description: seoData?.fields?.descriptionMetaTag?.content[0]?.content[0]?.value,
        // image: seoData.fields.image,
        ...data
    }
}