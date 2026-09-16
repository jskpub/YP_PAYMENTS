import React, {useState} from 'react';
import {MessageSquarePlus, X} from 'lucide-react';
import {BookComment} from '../types';

interface ChatRoomProps {
  comments: BookComment[];
  authorLabel: string;
  onSubmit: (text: string) => void;
}

/**
 * 이달 추천도서 전체에 대한 공용 채팅방.
 * 특정 한 권이 아니라 목록 전체를 두고 의견을 남긴다.
 */
export const ChatRoom: React.FC<ChatRoomProps> = ({comments, authorLabel, onSubmit}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draft, setDraft] = useState('');

  const closeModal = () => {
    setIsModalOpen(false);
    setDraft('');
  };

  const submit = () => {
    const text = draft.trim();
    if (!text) return;
    onSubmit(text);
    closeModal();
  };

  return (
    <section className="border-t border-yp-gray-200 bg-yp-gray-50 py-14">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-yp-ink">채팅방</h2>
            <p className="mt-1 text-sm text-yp-gray-500">
              이달의 추천도서를 읽은 임직원들이 남긴 의견입니다. 부서명만 공개됩니다.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex h-13 shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-yp-gray-800 px-6 py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            <MessageSquarePlus className="h-4 w-4" />
            채팅 남기기
          </button>
        </div>

        <div className="mt-6">
          {comments.length === 0 ? (
            <p className="py-14 text-center text-sm leading-relaxed text-yp-gray-400">
              아직 남겨진 의견이 없어요.
              <br />
              채팅방에 참여해서 첫 의견을 남겨보세요.
            </p>
          ) : (
            <ul>
              {comments.map((comment, index) => (
                <li
                  key={`${comment.author}-${comment.createdAt}-${index}`}
                  className="border-b border-yp-gray-200 py-5 last:border-b-0"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-bold text-yp-gray-700">{comment.author}</span>
                    <span className="text-xs tabular-nums text-yp-gray-300">
                      {comment.createdAt}
                    </span>
                  </div>
                  <p className="mt-2 break-keep text-[15px] leading-relaxed text-yp-ink">
                    {comment.text}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-yp-ink/60 p-4"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-yp-gray-100 p-5">
              <div>
                <h3 className="text-lg font-bold text-yp-ink">의견 남기기</h3>
                <p className="mt-1 text-xs text-yp-gray-500">
                  {authorLabel}으로 등록됩니다. 이름과 사번은 공개되지 않습니다.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label="닫기"
                className="cursor-pointer rounded p-1 text-yp-gray-400 hover:text-yp-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5">
              <textarea
                autoFocus
                value={draft}
                maxLength={140}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="이 달의 추천도서에 대한 의견을 남겨보세요"
                className="h-32 w-full resize-none rounded-lg border border-yp-gray-200 p-4 text-sm leading-relaxed text-yp-ink placeholder-yp-gray-300 focus:border-yp-red focus:outline-none focus:ring-2 focus:ring-yp-red/20"
              />
              <div className="mt-1 text-right text-xs tabular-nums text-yp-gray-400">
                {draft.length} / 140
              </div>
            </div>

            <div className="flex gap-2 border-t border-yp-gray-100 p-5">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 cursor-pointer rounded-lg border border-yp-gray-200 py-3 text-sm font-semibold text-yp-gray-700 hover:bg-yp-gray-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={draft.trim().length === 0}
                className="flex-1 cursor-pointer rounded-lg bg-yp-red py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-yp-gray-200 disabled:text-yp-gray-400"
              >
                등록
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
