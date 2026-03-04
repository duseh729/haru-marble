import { supabase } from "@/lib/supabase";
import { MarbleFactory } from "@/utils/MarbleFactory";

// 타입 정의
export interface Bottle {
  id: number;
  user_id: string;
  title: string;
  description?: string;
  is_pinned: boolean;
  created_at: string;
}

export interface Marble {
  id: number;
  bottle_id: number;
  content: string;
  color: string;
  date: string;
  created_at: string;
  position_x?: number;
  position_y?: number;
}

// ---------------------------------------------
// 📋 Tasks API (기존 호환용 - AppPage에서 사용)
// ---------------------------------------------
export const tasksApi = {
  // 특정 병의 오늘 구슬들 가져오기 (기존 getTasks 대체)
  getTasks: async (bottleId?: number) => {
    const query = supabase
      .from("marbles")
      .select("*")
      .order("created_at", { ascending: false });

    // bottleId가 있으면 필터링
    if (bottleId) {
      query.eq("bottle_id", bottleId);
    }

    const { data, error } = await query;

    if (error) throw error;

    // 기존 Task 형태로 변환
    return (data || []).map((marble: Marble) => ({
      id: marble.id,
      text: marble.content,
      color: marble.color,
      createdAt: marble.created_at,
      position_x: marble.position_x,
      position_y: marble.position_y,
    }));
  },

  // 구슬 넣기 (기존 createTask 대체)
  createTask: async (text: string, bottleId?: number, color?: string) => {
    const marbleColor = color || MarbleFactory.getRandomColor();

    const insertData: { content: string; color: string; bottle_id?: number } = {
      content: text,
      color: marbleColor,
    };

    if (bottleId) {
      insertData.bottle_id = bottleId;
    }

    const { data, error } = await supabase
      .from("marbles")
      .insert([insertData])
      .select()
      .single();

    if (error) throw error;

    // 기존 Task 형태로 반환
    return {
      id: data.id,
      text: data.content,
      color: data.color,
      createdAt: data.created_at,
    };
  },

  // 구슬 수정 (내용, 색상 변경 가능)
  updateTask: async (taskId: number, updates: { text?: string; color?: string }) => {
    const updateData: { content?: string; color?: string; created_at?: string } = {};

    if (updates.text !== undefined) {
      updateData.content = updates.text;
    }
    if (updates.color !== undefined) {
      updateData.color = updates.color;
    }

    // 수정 시 시간도 현재 시간으로 업데이트
    updateData.created_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("marbles")
      .update(updateData)
      .eq("id", taskId)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      text: data.content,
      color: data.color,
      createdAt: data.created_at,
    };
  },

  // 구슬 삭제
  deleteTask: async (taskId: number) => {
    const { error } = await supabase
      .from("marbles")
      .delete()
      .eq("id", taskId);

    if (error) throw error;
  },

  // 구슬 좌표 일괄 업데이트
  updatePositions: async (positions: { id: number; position_x: number; position_y: number }[]) => {
    // 각 구슬의 좌표를 개별 업데이트 (Supabase는 bulk upsert 지원)
    const promises = positions.map(({ id, position_x, position_y }) =>
      supabase
        .from("marbles")
        .update({ position_x, position_y })
        .eq("id", id)
    );

    const results = await Promise.all(promises);
    const errors = results.filter(r => r.error);
    if (errors.length > 0) {
      console.error("Failed to update some positions:", errors);
    }
  },
};

// ---------------------------------------------
// 🏺 Bottle API (유리병 관리)
// ---------------------------------------------
export const bottlesApi = {
  // 내 유리병 목록 가져오기
  getBottles: async () => {
    const { data, error } = await supabase
      .from("bottles")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data as Bottle[];
  },

  // 특정 유리병 가져오기
  getBottle: async (bottleId: number) => {
    const { data, error } = await supabase
      .from("bottles")
      .select("*")
      .eq("id", bottleId)
      .single();

    if (error) throw error;
    return data as Bottle;
  },

  // 새 유리병 만들기
  createBottle: async (title: string, description?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("로그인이 필요합니다.");

    const { data, error } = await supabase
      .from("bottles")
      .insert([
        {
          user_id: user.id,
          title: title,
          description: description,
          is_pinned: false,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data as Bottle;
  },

  // 유리병 삭제
  deleteBottle: async (bottleId: number) => {
    const { error } = await supabase
      .from("bottles")
      .delete()
      .eq("id", bottleId);

    if (error) throw error;
  },

  // 유리병 고정/해제
  togglePin: async (bottleId: number, isPinned: boolean) => {
    const { data, error } = await supabase
      .from("bottles")
      .update({ is_pinned: isPinned })
      .eq("id", bottleId)
      .select()
      .single();

    if (error) throw error;
    return data as Bottle;
  },

  // 유리병 이름 수정
  updateBottleTitle: async (bottleId: number, title: string) => {
    const { data, error } = await supabase
      .from("bottles")
      .update({ title })
      .eq("id", bottleId)
      .select()
      .single();

    if (error) throw error;
    return data as Bottle;
  },

  // 유리병 목록 + 각 병의 모든 구슬 함께 가져오기
  getBottlesWithMarbles: async () => {
    const { data, error } = await supabase
      .from("bottles")
      .select("*, marbles(*)")
      .order("created_at", { ascending: true });

    if (error) throw error;

    return (data || []).map((bottle: Bottle & { marbles: Marble[] }) => ({
      ...bottle,
      marbles: (bottle.marbles || []).sort(
        (a: Marble, b: Marble) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      ),
    })) as (Bottle & { marbles: Marble[] })[];
  },
};

// ---------------------------------------------
// 🔮 Marble API (구슬/Done-List 관리)
// ---------------------------------------------
export const marblesApi = {
  // 특정 유리병 속의 구슬들 가져오기
  getMarbles: async (bottleId: number) => {
    const { data, error } = await supabase
      .from("marbles")
      .select("*")
      .eq("bottle_id", bottleId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Marble[];
  },

  // 구슬 넣기
  createMarble: async (content: string, bottleId: number) => {
    const marbleColor = MarbleFactory.getRandomColor();

    const { data, error } = await supabase
      .from("marbles")
      .insert([
        {
          bottle_id: bottleId,
          content: content,
          color: marbleColor,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data as Marble;
  },

  // 구슬 삭제
  deleteMarble: async (marbleId: number) => {
    const { error } = await supabase
      .from("marbles")
      .delete()
      .eq("id", marbleId);

    if (error) throw error;
  }
};

// ---------------------------------------------
// ⚡ Frequent Tasks API (자주 하는 일)
// ---------------------------------------------
export interface FrequentTask {
  id: number;
  content: string;
  created_at: string;
}

export const frequentTasksApi = {
  // 전체 목록 가져오기
  getAll: async () => {
    const { data, error } = await supabase
      .from("frequent_tasks")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data as FrequentTask[];
  },

  // 새로 추가
  create: async (content: string) => {
    const { data, error } = await supabase
      .from("frequent_tasks")
      .insert([{ content }])
      .select()
      .single();

    if (error) throw error;
    return data as FrequentTask;
  },

  // 삭제
  delete: async (id: number) => {
    const { error } = await supabase
      .from("frequent_tasks")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};