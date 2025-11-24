import { AssessmentSchema, ScaleType } from './types';

export const DISCLAIMER_TEXT = `
本应用仅为心理健康筛查工具，并非专业医疗诊断仪器。
测试结果仅供信息参考，不构成任何医疗建议、诊断或治疗方案。
如果您正处于危机之中，有自伤、自杀的念头，或需要紧急援助，请立即联系校园辅导员、去医院就诊或拨打紧急求助电话。
`;

const commonOptions = [
  { label: "完全不会", value: 0 },
  { label: "好几天", value: 1 },
  { label: "一半以上的天数", value: 2 },
  { label: "几乎每天", value: 3 },
];

export const PHQ9_SCHEMA: AssessmentSchema = {
  id: ScaleType.PHQ9,
  title: "PHQ-9 (抑郁症筛查量表)",
  description: "用于监测抑郁症状严重程度及治疗反应的标准化工具。",
  questions: [
    { id: 1, text: "做事提不起劲或没有兴趣", options: commonOptions },
    { id: 2, text: "感到心情低落、抑郁或绝望", options: commonOptions },
    { id: 3, text: "入睡困难、睡不安稳或睡眠过多", options: commonOptions },
    { id: 4, text: "感觉疲倦或没有活力", options: commonOptions },
    { id: 5, text: "食欲不振或吃得太多", options: commonOptions },
    { id: 6, text: "觉得自己很糟，或觉得自己很失败，或让自己、家人失望", options: commonOptions },
    { id: 7, text: "对事物专注有困难，例如阅读报纸或看电视时", options: commonOptions },
    { id: 8, text: "行动或说话速度缓慢到别人已经察觉？或正好相反——烦躁或坐立不安，动来动去的情况比平常更明显", options: commonOptions },
    { id: 9, text: "有不如死掉或用某种方式伤害自己的念头", options: commonOptions },
  ],
  severityMap: (score: number) => {
    if (score <= 4) return { level: "无明显抑郁", color: "#10b981", advice: "请继续保持健康的生活习惯。" };
    if (score <= 9) return { level: "轻度抑郁", color: "#84cc16", advice: "请关注情绪变化，尝试自我调节与放松。" };
    if (score <= 14) return { level: "中度抑郁", color: "#f59e0b", advice: "建议咨询学校心理辅导员或专业人士。" };
    if (score <= 19) return { level: "中重度抑郁", color: "#f97316", advice: "建议寻求专业心理咨询或医疗帮助。" };
    return { level: "重度抑郁", color: "#ef4444", advice: "请立即就医或寻求紧急专业援助。" };
  }
};

export const GAD7_SCHEMA: AssessmentSchema = {
  id: ScaleType.GAD7,
  title: "GAD-7 (焦虑症筛查量表)",
  description: "用于筛查广泛性焦虑障碍并测量其严重程度的标准化工具。",
  questions: [
    { id: 1, text: "感觉紧张、焦虑或急切", options: commonOptions },
    { id: 2, text: "不能停止或无法控制担忧", options: commonOptions },
    { id: 3, text: "对各种各样的事情担忧过多", options: commonOptions },
    { id: 4, text: "很难放松下来", options: commonOptions },
    { id: 5, text: "由于坐立不安而无法静坐", options: commonOptions },
    { id: 6, text: "变得容易烦恼或急躁", options: commonOptions },
    { id: 7, text: "感到好像有什么可怕的事就要发生", options: commonOptions },
  ],
  severityMap: (score: number) => {
    if (score <= 4) return { level: "无明显焦虑", color: "#10b981", advice: "练习放松技巧，保持良好状态。" };
    if (score <= 9) return { level: "轻度焦虑", color: "#f59e0b", advice: "观察引发焦虑的诱因，注意劳逸结合。" };
    if (score <= 14) return { level: "中度焦虑", color: "#f97316", advice: "建议进行专业评估与咨询。" };
    return { level: "重度焦虑", color: "#ef4444", advice: "很可能需要积极的治疗介入，请尽快就医。" };
  }
};