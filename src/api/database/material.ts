import { fetchTextMap } from "@/api/database/text";
import {
  MaterialData,
  MaterialExcelConfigData,
  MaterialMap,
  TextMap,
} from "@/types/database";
import _ from "lodash";

export async function fetchMaterials(text?: TextMap): Promise<MaterialMap> {
  const data = (
    await import(
      "../../external/GenshinData/ExcelBinOutput/MaterialExcelConfigData.json"
    )
  ).default as MaterialExcelConfigData[];

  const textMap = text ?? (await fetchTextMap());

  return _.chain(data)
    .keyBy((data) => data.Id ?? 0)
    .mapValues(
      (data): MaterialData => ({
        id: data.Id ?? 0,
        name: textMap[data.NameTextMapHash],
        description: textMap[data.DescTextMapHash],
        interactionTitle: textMap[data.InteractionTitleTextMapHash],
        effectDescription: textMap[data.EffectDescTextMapHash],
        specialDescription: textMap[data.SpecialDescTextMapHash],
        type: textMap[data.TypeDescTextMapHash],
        stars: data.RankLevel ?? 0,
        icon: data.Icon,
      }),
    )
    .value();
}
