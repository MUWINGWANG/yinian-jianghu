#!/usr/bin/env python3
"""
《一念江湖》美术资产批量生成脚本
使用混元 HY-Image-Lite 模型生成 12 NPC 立绘 + 5 门派徽章
"""

import requests
import time
import os
import json
from pathlib import Path

API_KEY = "***REDACTED***"
SUBMIT_URL = "https://tokenhub.tencentmaas.com/v1/api/image/submit"
QUERY_URL  = "https://tokenhub.tencentmaas.com/v1/api/image/query"
MODEL      = "hy-image-lite"

HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
}

# 公共风格前缀（每张图都加）
STYLE_PREFIX = (
    "中国古典工笔彩绘风格插画，明代武侠题材，"
    "精细毛笔线条，朱砂红与墨色为主色调，"
    "竖版半身人物肖像，古朴典雅，"
    "人物面部表情细腻传神，服饰纹样清晰可见，"
    "背景简洁但富有意境，整体氛围古朴庄重，高质量插画。"
)

IMAGES = [
    # ─── 正道三派 · 青云门 ──────────────────────────────────
    {
        "file": "npcs/jiang-henian.png",
        "prompt": STYLE_PREFIX + (
            "人物：姜鹤年，青云门掌门，五十五岁男性，儒将风骨。"
            "外貌：国字脸，颧骨微高，下颌有修整整齐的灰白短须，"
            "双眉浓黑微蹙，眼角布有细纹，眼神锐利中藏着疲惫与算计，"
            "是一个看尽风云却选择沉默的实用主义者的面孔。"
            "服饰：身着靛蓝色暗纹官服，领口绣有云纹，"
            "腰系白玉带钩，右肩隐约可见剑柄。"
            "姿态：微微侧身四分之三角度，右手虚握拳放于胸前，"
            "气势沉稳，不怒自威。"
            "背景：淡墨渲染的青竹剪影，远处隐约有朱砂色印章图案。"
            "色调：靛蓝为主，墨绿竹影，朱砂点缀，整体肃穆。"
        ),
    },
    {
        "file": "npcs/shen-ruyu.png",
        "prompt": STYLE_PREFIX + (
            "人物：沈如玉，青云门年轻剑客，二十三岁男性，赤诚理想主义者。"
            "外貌：剑眉星目，面部轮廓清俊，皮肤白皙，"
            "眼神明亮而坚定，带着年轻人特有的灼热与偏执，"
            "嘴唇微微抿紧，透出一种「正义必须伸张」的执拗。"
            "服饰：浅青色剑客劲装，右肩斜披白色练功巾，"
            "腰间悬一柄直剑，剑鞘素雅，剑穗随风飘动。"
            "姿态：昂首挺立，正面偏左四分之三，右手按剑柄，意气风发。"
            "背景：淡蓝色天空，远山青黛，几缕白云，象征年轻的理想。"
            "色调：青白为主，剑光银色，朝气蓬勃。"
        ),
    },
    # ─── 正道三派 · 灵隐宗 ──────────────────────────────────
    {
        "file": "npcs/liaoChen-dashi.png",
        "prompt": STYLE_PREFIX + (
            "人物：了尘大师，灵隐宗方丈，六十五岁男性，悲悯长者。"
            "外貌：面容宽厚，皱纹深刻而慈祥，"
            "头顶光洁（僧侣剃度），眉毛雪白浓密微微下垂，"
            "眼神温润如水，嘴角带有若有若无的微笑，"
            "是一个「知道答案却等你自己悟」的智者表情。"
            "服饰：灰绿色宽袖僧衣，胸前挂一串深棕色沉香佛珠，"
            "衣料质朴但洗得干净整洁。"
            "姿态：双手合十于胸前，微微低头，气息沉静如山。"
            "背景：淡墨荷花池，水面倒影隐约，远处有寺庙飞檐轮廓。"
            "色调：灰绿为主，金色佛光点缀，静谧庄严。"
        ),
    },
    {
        "file": "npcs/huiming.png",
        "prompt": STYLE_PREFIX + (
            "人物：慧明，灵隐宗年轻僧人，二十岁男性，困惑的求道者。"
            "外貌：面容清秀稚嫩，头顶有戒疤点痕，"
            "眼睛大而明亮，却隐藏着困惑与不安，眉头微微皱起，"
            "是一个内心正在激烈挣扎「慈悲是否等于逃避」的少年面孔。"
            "服饰：简朴深灰色僧衣，袖口略显宽大，"
            "手中捏着一串小佛珠，手指有些用力。"
            "姿态：略微垂头沉思，眼神向上抬起，有一种「快要说什么又咽回去」的感觉。"
            "背景：晨雾弥漫的寺庙廊柱，光线幽暗，一缕阳光从侧面斜入。"
            "色调：灰色为主，晨光金黄，迷茫的柔和氛围。"
        ),
    },
    # ─── 正道三派 · 太虚观 ──────────────────────────────────
    {
        "file": "npcs/xuanji-zi.png",
        "prompt": STYLE_PREFIX + (
            "人物：玄机子，太虚观掌门，四十五岁男性，魅力型反派。"
            "外貌：面容清俊飘逸，蓄有精心修剪的黑色美须，"
            "眼眸深邃如渊，带着一种令人无法抗拒的智识魅力，"
            "嘴角常带若有若无的微笑，让人分不清是善意还是算计，"
            "眉宇舒展，是江湖公认的「最值得信赖的人」，也最危险。"
            "服饰：白色广袖道袍，领口绣有阴阳鱼纹，"
            "腰系玄色丝绦，手持一柄白玉拂尘，羽毛轻盈飘散。"
            "姿态：侧身而立，半转向观者，拂尘轻搭于臂弯，从容淡然。"
            "背景：太极八卦阴阳图纹，淡墨云雾缭绕，飘渺神秘。"
            "色调：白色为主，玄色点缀，淡金色光晕，高深莫测。"
        ),
    },
    {
        "file": "npcs/lingshuang.png",
        "prompt": STYLE_PREFIX + (
            "人物：凌霜，太虚观女弟子，二十六岁女性，被困的知情者。"
            "外貌：面容清丽，肤色如玉，"
            "眉眼精致却带着难以掩盖的忧郁，嘴唇微微抿紧，"
            "眼神中有痛苦的挣扎与压抑的怒火，"
            "是一个知道真相却无力揭穿、只能隐忍的女子神情。"
            "服饰：白色女式道袍，发髻用素银簪子挽起，"
            "几缕发丝散落额前，腰间挂有小葫芦法器。"
            "姿态：微微侧身，双手交叠于腰前，眼神望向远处，若有所思。"
            "背景：淡墨寒梅，梅花半开，枝干清瘦，象征被困的意志。"
            "色调：白色为主，朱砂梅花点缀，清冷孤寂。"
        ),
    },
    # ─── 魔道两派 · 血煞堂 ──────────────────────────────────
    {
        "file": "npcs/lu-ming.png",
        "prompt": STYLE_PREFIX + (
            "人物：陆铭，血煞堂执行者，三十五岁男性，职业杀手。"
            "外貌：面容轮廓硬朗，没有多余表情，"
            "眼神锐利冷静如刀，看任何东西都像在评估致命距离，"
            "嘴唇薄而紧抿，下巴有淡淡的胡茬，"
            "脸上有一道细长旧疤从左眉尾斜至颧骨，是唯一的「装饰」。"
            "服饰：黑色暗纹劲装，领口微微展开，"
            "右手腕处露出一截皮革护腕，隐约有暗器机关轮廓。"
            "姿态：正面略偏，双臂自然垂落，气质极度危险而沉静，"
            "像一把出鞘前的剑。"
            "背景：纯黑深邃，隐约有血色暗纹图案。"
            "色调：黑色为主，血红点缀，极简冷峻。"
        ),
    },
    {
        "file": "npcs/suyi-gui.png",
        "prompt": STYLE_PREFIX + (
            "人物：素衣鬼，血煞堂暗桩，年龄性别不明，多重身份。"
            "外貌：全身被白色薄纱遮盖，只露出一双眼睛，"
            "那双眼睛深不可测，瞳孔颜色深黑，"
            "眼神平静得令人不安，像是看穿了一切却不在乎，"
            "眼角有细碎的暗色纹理妆饰。"
            "服饰：白色宽松外袍，像是丧服又像是道袍，"
            "质地轻薄飘动，无任何装饰，左手持一把黑色折扇，半开。"
            "姿态：正面直视，毫无防备感却让人无从靠近。"
            "背景：纯白朦胧雾气，边缘若隐若现的黑色藤蔓纹样。"
            "色调：白色与黑色对比，神秘诡异，令人不安。"
        ),
    },
    # ─── 魔道两派 · 荒原帮 ──────────────────────────────────
    {
        "file": "npcs/yan-sandao.png",
        "prompt": STYLE_PREFIX + (
            "人物：燕三刀，荒原帮帮主，四十岁男性，草莽义士。"
            "外貌：面容粗犷豪迈，肤色偏深如被风沙侵蚀，"
            "留有浓密的短胡须，眉毛粗黑，眼神虽粗犷却透着侠义之气，"
            "一种「我不相信你但我愿意给你一次机会」的豪爽表情。"
            "服饰：粗麻布武装，肩披兽皮，"
            "腰间横插三把短刀，刀鞘磨损明显，是真正用过的。"
            "姿态：叉腰而立，正面偏右，微微仰头，气势如山。"
            "背景：黄土荒原，远处有低矮山丘剪影，天空橙红如晚霞。"
            "色调：黄褐土色为主，刀光冷钢，热血豪情。"
        ),
    },
    {
        "file": "npcs/liu-qiniang.png",
        "prompt": STYLE_PREFIX + (
            "人物：柳七娘，荒原帮女将，二十八岁女性，被驱逐的前武林人。"
            "外貌：五官英气，面容俊俏但带风霜，"
            "发型凌乱扎成马尾，几缕碎发垂于脸颊，"
            "眼神锐利而带苦涩，嘴角有一抹讽刺的弧度，"
            "那是一个「被你们称作魔道，那就彻底做个魔道」的面孔。"
            "服饰：暗红色破旧武装，右臂包扎着布条，"
            "背后隐约可见单刀刀鞘，腰间有流苏装饰。"
            "姿态：侧身倚靠，手臂交叉，挑眉望向观者，不屑而警惕。"
            "背景：荒野夕阳，枯草随风，远处有孤鸦飞过。"
            "色调：暗红与土黄，苦涩而坚韧。"
        ),
    },
    # ─── 游离人士 ─────────────────────────────────────────
    {
        "file": "npcs/gu-changfeng.png",
        "prompt": STYLE_PREFIX + (
            "人物：顾长风，独立游侠，三十二岁男性，前青云门弟子。"
            "外貌：面容清俊略带风尘，眼神明亮而带着看透世事的洒脱，"
            "嘴角时常挂着一抹玩世不恭的微笑，"
            "却不是轻浮，而是「我什么都知道，所以不必执着」的淡然，"
            "有几分薄薄的络腮胡，发型随意用布条束起。"
            "服饰：素色旅人长衫，褶皱自然，是走了很多路的衣服，"
            "腰间挂有酒葫芦和锦囊，背上斜挎一柄细长剑。"
            "姿态：半侧身，一手托腮，眼神斜睨向一侧，悠然自得。"
            "背景：驿道旁的老槐树，树下有茶摊，江湖风情。"
            "色调：素白与浅褐，随性洒脱，万事看开。"
        ),
    },
    {
        "file": "npcs/ji-wantang.png",
        "prompt": STYLE_PREFIX + (
            "人物：纪晚棠，朝廷密探，二十九岁男性，伪装商人。"
            "外貌：面容生得普通，这本身就是最好的伪装，"
            "五官中正，不特别英俊也不难看，"
            "眼神平和随意，但偶尔一瞬间会显出不属于商人的锐利警觉，"
            "嘴角习惯性地带着商人式的圆滑微笑。"
            "服饰：普通富商青灰色长袍，质地上好但不张扬，"
            "领口有素色绣纹，手持折扇，装束无懈可击地像个普通人。"
            "姿态：微微躬身作揖状，商人礼仪，但脊背实则挺直。"
            "背景：市集街道，商铺招牌，熙攘人群虚化背景。"
            "色调：青灰低调，金色点缀，张力在于平静外表下的暗涌。"
        ),
    },
    # ─── 门派徽章 ─────────────────────────────────────────
    {
        "file": "factions/badge-qingyun.png",
        "prompt": (
            "中国古典篆刻印章风格，朱砂红圆形徽章，"
            "青云门门派图腾，中央图案为一柄直剑竖立于展开的书卷之上，"
            "剑身细长，剑尖向上，书卷两侧展开，"
            "外圈有繁体篆书「青云门」三字环绕，"
            "四角有云纹装饰，整体风格古朴庄重，"
            "朱砂红底色，白色线条刻纹，印章质感强烈，"
            "高对比度，细节精致，正方形构图居中。"
        ),
    },
    {
        "file": "factions/badge-lingyin.png",
        "prompt": (
            "中国古典篆刻印章风格，深绿色圆形徽章，"
            "灵隐宗门派图腾，中央图案为盛开莲花，"
            "莲花共八瓣，中心有法轮符号，"
            "花瓣周围环绕一串佛珠，"
            "外圈有繁体篆书「灵隐宗」三字环绕，"
            "整体风格禅意悠远，绿底金纹，"
            "高对比度，细节精致，正方形构图居中。"
        ),
    },
    {
        "file": "factions/badge-taixu.png",
        "prompt": (
            "中国古典篆刻印章风格，玄色圆形徽章，"
            "太虚观门派图腾，中央图案为太极阴阳鱼，"
            "阴阳鱼周围有八卦符文环绕，外层有飘动的云纹，"
            "外圈有繁体篆书「太虚观」三字环绕，"
            "整体风格神秘飘渺，黑底白纹，"
            "高对比度，细节精致，正方形构图居中。"
        ),
    },
    {
        "file": "factions/badge-xueshao.png",
        "prompt": (
            "中国古典篆刻印章风格，血红色圆形徽章，"
            "血煞堂门派图腾，中央图案为一只鬼手（五指张开的骷髅手），"
            "手掌中心有暗器飞镖图案，"
            "周围有滴落的血滴纹样，"
            "外圈有繁体篆书「血煞堂」三字环绕，"
            "整体风格阴森危险，深红底色，黑色线条，"
            "高对比度，细节精致，正方形构图居中。"
        ),
    },
    {
        "file": "factions/badge-huangyuan.png",
        "prompt": (
            "中国古典篆刻印章风格，黄褐色圆形徽章，"
            "荒原帮门派图腾，中央图案为三把刀交叉排列，"
            "刀身粗犷有缺口，象征实战痕迹，"
            "周围有荒草与沙尘纹样，"
            "外圈有繁体篆书「荒原帮」三字环绕，"
            "整体风格粗犷豪迈，黄褐底色，深棕线条，"
            "高对比度，细节精致，正方形构图居中。"
        ),
    },
]


PROXIES = {"http": None, "https": None}  # 绕过系统代理


def _post(url: str, payload: dict, retries: int = 5) -> dict:
    for attempt in range(retries):
        try:
            resp = requests.post(
                url, headers=HEADERS, json=payload,
                proxies=PROXIES, verify=True, timeout=30
            )
            resp.raise_for_status()
            return resp.json()
        except Exception as e:
            if attempt == retries - 1:
                raise
            time.sleep(3 * (attempt + 1))


def submit_job(prompt: str) -> str:
    data = _post(SUBMIT_URL, {"model": MODEL, "prompt": prompt})
    job_id = data.get("id")
    if not job_id or data.get("status") == "failed":
        raise ValueError(f"提交失败：{data}")
    return job_id


def poll_job(job_id: str, timeout: int = 180) -> str:
    deadline = time.time() + timeout
    while time.time() < deadline:
        data = _post(QUERY_URL, {"model": MODEL, "id": job_id})
        status = data.get("status")
        if status == "completed":
            return data["data"][0]["url"]
        if status in ("failed", "cancelled"):
            raise RuntimeError(f"任务失败：{data}")
        time.sleep(5)
    raise TimeoutError(f"任务超时：{job_id}")


def download(url: str, dest: Path):
    resp = requests.get(url, proxies=PROXIES, timeout=60)
    resp.raise_for_status()
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(resp.content)


def main():
    base_dir = Path("/Users/lifeiyang/Desktop/yinian-jianghu/assets/images")
    log_file = base_dir.parent.parent / "generation_log.json"
    jobs = []

    print(f"共 {len(IMAGES)} 张图，逐张生成（并发限制 1）...\n")

    for i, item in enumerate(IMAGES, 1):
        dest = base_dir / item["file"]
        if dest.exists():
            print(f"  [{i:02d}/{len(IMAGES)}] [跳过] {item['file']} 已存在")
            jobs.append({"file": item["file"], "status": "skipped"})
            continue

        print(f"  [{i:02d}/{len(IMAGES)}] 提交 {item['file']}...", end=" ", flush=True)
        try:
            job_id = submit_job(item["prompt"])
            print(f"排队中，轮询...", end=" ", flush=True)
            url = poll_job(job_id)
            download(url, dest)
            jobs.append({"file": item["file"], "status": "done", "url": url})
            print("✓ 完成")
        except Exception as e:
            jobs.append({"file": item["file"], "status": "error", "error": str(e)})
            print(f"✗ 失败：{e}")

        time.sleep(1)  # 任务间隔

    log_file.write_text(json.dumps(jobs, ensure_ascii=False, indent=2))
    done = sum(1 for j in jobs if j["status"] == "done")
    print(f"\n完成 {done}/{len(IMAGES)} 张，日志写入 {log_file}")


if __name__ == "__main__":
    main()
