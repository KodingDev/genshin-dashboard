import { fetchSkills } from "@/api/database/avatar/skill/skill";
import { fetchTalents } from "@/api/database/avatar/skill/talent";
import _ from "lodash";
import {
  AvatarSkillDepot,
  AvatarSkillDepotExcelConfigData,
  AvatarSkillMap,
  SkillDepotMap,
} from "@/types/database/avatar/skill";
import { AvatarTalentMap } from "@/types/database/avatar/talent";

export async function fetchSkillDepot(
  skill?: AvatarSkillMap,
  talent?: AvatarTalentMap,
): Promise<SkillDepotMap> {
  const data = (
    await import(
      "../../../../external/GenshinData/ExcelBinOutput/AvatarSkillDepotExcelConfigData.json"
    )
  ).default as AvatarSkillDepotExcelConfigData[];

  const skillMap = skill ?? (await fetchSkills());
  const talentMap = talent ?? (await fetchTalents());

  return _.chain(data)
    .keyBy((data) => data.Id ?? 0)
    .mapValues(
      (data): AvatarSkillDepot => ({
        id: data.Id ?? 0,
        skills: {
          energy: skillMap[data.EnergySkill] ?? null,
          combat: data.Skills.map((id) => skillMap[id]).filter((v) => v),
          secondary: data.SubSkills.map((id) => skillMap[id]).filter((v) => v),
        },
        constellations: {
          leader: talentMap[data.LeaderTalent] ?? null,
          talents: data.Talents.map((id) => talentMap[id]).filter((v) => v),
        },
      }),
    )
    .value();
}
