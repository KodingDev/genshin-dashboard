import { fetchTextMap } from "@/api/database/text";
import { fetchMaterials } from "@/api/database/material";
import _ from "lodash";
import { TextMap } from "@/types/database/consts";
import { MaterialMap } from "@/types/database/material";
import {
  AvatarTalent,
  AvatarTalentExcelConfigData,
  AvatarTalentMap,
} from "@/types/database/avatar/talent";

export async function fetchTalents(
  text?: TextMap,
  material?: MaterialMap,
): Promise<AvatarTalentMap> {
  const data = (
    await import("../../../../external/GenshinData/ExcelBinOutput/AvatarTalentExcelConfigData.json")
  ).default as AvatarTalentExcelConfigData[];

  const textMap = text ?? (await fetchTextMap());
  const materialMap = material ?? (await fetchMaterials(textMap));

  return _.chain(data)
    .keyBy((data) => data.TalentId ?? 0)
    .mapValues(
      (data): AvatarTalent => ({
        id: data.TalentId ?? 0,
        name: textMap[data.NameTextMapHash],
        description: textMap[data.DescTextMapHash],
        cost: {
          item: materialMap[data.MainCostItemId],
          amount: data.MainCostItemCount,
        },
      }),
    )
    .value();
}
