import {
  BANNER_STANDARD,
  GENERIC_SECTION,
  HERO_BANNER,
  SLIDER_HERO,
} from "@/lib/constant/contentTypeConstant";
import SliderHero from "@/components/SliderHero";
import { getBannerContentConversion } from "./shortHandFunction/getBannerContentConversion";
import { getSliderHeroConversion } from "./shortHandFunction/getSliderHeroConversion";
import BannerStandard from "@/components/BannerStandard";
import GenericSection from "@/components/GenericSection";

export const loadComponents = (pageData: any): any => {
  const components = pageData.fields.content.fields.section.map((item: any) => {
    if (item?.sys?.contentType?.sys?.id === BANNER_STANDARD) {
      return (
        <BannerStandard
          key={item.sys.id}
          bannerStandardData={getBannerContentConversion(item)}
        />
      );
    }
    {JSON.stringify(item)}
    if (item?.sys?.contentType?.sys?.id === GENERIC_SECTION) {
      return <GenericSection key={item.sys.id} data={item} />;
    }
    return <></>;
  });
  return components;
};
