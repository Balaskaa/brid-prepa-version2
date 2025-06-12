import { useState, useEffect } from 'react';
import { useUserAnswers } from '@/hooks/useUserAnswers';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Loader2,
  Award,
  Target,
  BookOpen
} from 'lucide-react';

interface DetailedAnswerReviewProps {
  attemptId: string;
}

export const DetailedAnswerReview = ({ attemptId }: DetailedAnswerReviewProps) => {
  const { data: userAnswers, isLoading } = useUserAnswers(attemptId);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleQuestion = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const expandAll = () => {
    if (userAnswers) {
      setExpandedQuestions(new Set(userAnswers.map(answer => answer.question_id)));
    }
  };

  const collapseAll = () => {
    setExpandedQuestions(new Set());
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-2 w-full max-w-full overflow-hidden">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center mb-3 animate-pulse">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <Loader2 className="w-4 h-4 animate-spin text-emerald-600 mb-2" />
        <span className="text-gray-600 text-sm text-center max-w-full">جاري تحميل تفاصيل الإجابات...</span>
        <div className="w-32 max-w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-3">
          <div className="w-full h-full bg-gradient-to-r from-emerald-400 to-blue-500 animate-pulse rounded-full" />
        </div>
      </div>
    );
  }

  if (!userAnswers || userAnswers.length === 0) {
    return (
      <div className="text-center py-8 px-2 w-full max-w-full overflow-hidden">
        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-5 h-5 text-gray-400" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">لا توجد بيانات متاحة</h3>
        <p className="text-gray-600 text-sm">لا توجد تفاصيل متاحة لهذا الاختبار</p>
      </div>
    );
  }

  const correctAnswers = userAnswers.filter(answer => answer.is_correct).length;
  const totalQuestions = userAnswers.length;
  const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);

  return (
    <div className="w-full max-w-full overflow-x-hidden" dir="rtl">
      <div className="space-y-3 px-1">
        {/* Summary Section - Fully Responsive */}
        <div className="w-full max-w-full p-3 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-emerald-200 shadow-sm overflow-hidden">
          <div className="flex flex-col items-center gap-2 mb-3 w-full">
            <div className="flex items-center gap-2 w-full justify-center">
              {scorePercentage >= 70 ? (
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="w-4 h-4 text-white" />
                </div>
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Target className="w-4 h-4 text-white" />
                </div>
              )}
              <div className="text-center min-w-0 flex-1">
                <h4 className="text-sm font-bold text-gray-900 truncate">
                  النتيجة: {scorePercentage}%
                </h4>
                <p className="text-gray-600 text-xs truncate">
                  {correctAnswers} صحيح من {totalQuestions}
                </p>
              </div>
            </div>
            
            <div className="flex gap-1 w-full justify-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={expandAll} 
                className="text-xs px-2 py-1 h-auto min-h-[32px] flex-1 max-w-[120px]"
              >
                <ChevronDown className="w-3 h-3 ml-1" />
                <span className="truncate">توسيع الكل</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={collapseAll} 
                className="text-xs px-2 py-1 h-auto min-h-[32px] flex-1 max-w-[120px]"
              >
                <ChevronUp className="w-3 h-3 ml-1" />
                <span className="truncate">طي الكل</span>
              </Button>
            </div>
          </div>

          {/* Performance indicators - Responsive grid */}
          <div className="grid grid-cols-3 gap-1 mb-3 w-full">
            <div className="flex-1 text-center p-1.5 bg-emerald-100 rounded-lg border border-emerald-200 min-w-0">
              <CheckCircle className="w-3 h-3 text-emerald-600 mx-auto mb-0.5" />
              <div className="text-xs font-bold text-emerald-700 truncate">{correctAnswers}</div>
              <div className="text-[10px] text-emerald-600 truncate">صحيحة</div>
            </div>
            <div className="flex-1 text-center p-1.5 bg-red-100 rounded-lg border border-red-200 min-w-0">
              <XCircle className="w-3 h-3 text-red-600 mx-auto mb-0.5" />
              <div className="text-xs font-bold text-red-700 truncate">{totalQuestions - correctAnswers}</div>
              <div className="text-[10px] text-red-600 truncate">خاطئة</div>
            </div>
            <div className="flex-1 text-center p-1.5 bg-blue-100 rounded-lg border border-blue-200 min-w-0">
              <Target className="w-3 h-3 text-blue-600 mx-auto mb-0.5" />
              <div className="text-xs font-bold text-blue-700 truncate">{scorePercentage}%</div>
              <div className="text-[10px] text-blue-600 truncate">النسبة</div>
            </div>
          </div>

          {/* Performance message */}
          <div className={`p-2 rounded-lg border text-xs text-center w-full overflow-hidden ${
            scorePercentage >= 70 
              ? 'bg-emerald-100 border-emerald-300 text-emerald-800' 
              : 'bg-yellow-100 border-yellow-300 text-yellow-800'
          }`}>
            <div className="truncate">
              {scorePercentage >= 90 && "🏆 ممتاز!"}
              {scorePercentage >= 80 && scorePercentage < 90 && "🌟 جيد جداً!"}
              {scorePercentage >= 70 && scorePercentage < 80 && "✅ جيد"}
              {scorePercentage >= 60 && scorePercentage < 70 && "⚠️ يحتاج مراجعة"}
              {scorePercentage < 60 && "📚 يحتاج تدريب إضافي"}
            </div>
          </div>
        </div>

        {/* Questions List - Fully Responsive */}
        <div className="space-y-2 w-full max-w-full overflow-hidden">
          <div className="flex items-center justify-between px-1 w-full">
            <h3 className="text-sm font-bold text-gray-900 truncate flex-1">مراجعة الأسئلة</h3>
            <Badge variant="outline" className="text-xs flex-shrink-0 ml-2">
              {totalQuestions} سؤال
            </Badge>
          </div>
          
          {userAnswers.map((userAnswer, index) => {
            const question = userAnswer.questions;
            const isExpanded = expandedQuestions.has(userAnswer.question_id);
            const selectedOption = question?.answer_options?.find(
              option => option.id === userAnswer.selected_option_id
            );
            const correctOption = question?.answer_options?.find(
              option => option.is_correct
            );

            return (
              <Card 
                key={userAnswer.id} 
                className={`border w-full max-w-full overflow-hidden ${
                  userAnswer.is_correct 
                    ? 'border-emerald-300 bg-emerald-50/50' 
                    : 'border-red-300 bg-red-50/50'
                }`}
              >
                <CardContent className="p-2">
                  <div 
                    className="flex items-start gap-2 cursor-pointer w-full"
                    onClick={() => toggleQuestion(userAnswer.question_id)}
                  >
                    {/* Status icon - small and compact */}
                    <div className="flex-shrink-0 mt-0.5">
                      {userAnswer.is_correct ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 w-full overflow-hidden">
                      <div className="flex items-start justify-between gap-1 w-full">
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <div className="flex items-center gap-1 flex-wrap mb-1">
                            <h5 className="font-bold text-xs text-gray-900 flex-shrink-0">
                              السؤال {index + 1}
                            </h5>
                            <Badge 
                              variant={userAnswer.is_correct ? "secondary" : "destructive"}
                              className="text-[10px] px-1 py-0 leading-none flex-shrink-0"
                            >
                              {userAnswer.is_correct ? '✓ صحيح' : '✗ خطأ'}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-800 text-xs font-medium break-words overflow-wrap-anywhere leading-relaxed">
                            {question?.question_text}
                          </p>
                        </div>
                        <div className="flex-shrink-0 ml-1">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {/* Quick summary */}
                      <div className="mt-2 space-y-1 w-full overflow-hidden">
                        <div className="flex flex-wrap items-center gap-1 w-full">
                          <span className="text-gray-600 text-[10px] flex-shrink-0">إجابتك:</span>
                          <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] min-w-0 max-w-full overflow-hidden ${
                            userAnswer.is_correct 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {userAnswer.is_correct ? 
                              <CheckCircle className="w-2.5 h-2.5 flex-shrink-0" /> : 
                              <XCircle className="w-2.5 h-2.5 flex-shrink-0" />
                            }
                            <span className="font-semibold truncate min-w-0">
                              {selectedOption ? 
                                `${String.fromCharCode(65 + selectedOption.option_index)}) ${selectedOption.option_text}` : 
                                'لم تُجب'
                              }
                            </span>
                          </div>
                        </div>
                        
                        {!userAnswer.is_correct && correctOption && (
                          <div className="flex flex-wrap items-center gap-1 w-full">
                            <span className="text-gray-600 text-[10px] flex-shrink-0">الصحيحة:</span>
                            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] min-w-0 max-w-full overflow-hidden">
                              <CheckCircle className="w-2.5 h-2.5 flex-shrink-0" />
                              <span className="font-semibold truncate min-w-0">
                                {String.fromCharCode(65 + correctOption.option_index)}) {correctOption.option_text}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="mt-3 space-y-2 border-t border-gray-200 pt-3 w-full max-w-full overflow-hidden">
                      <h6 className="font-bold text-gray-900 text-xs flex items-center gap-1 mb-1">
                        <Target className="w-3 h-3 text-blue-600 flex-shrink-0" />
                        <span className="truncate">الخيارات:</span>
                      </h6>
                      
                      {question?.answer_options
                        ?.sort((a, b) => a.option_index - b.option_index)
                        .map((option) => {
                          const isUserAnswer = option.id === userAnswer.selected_option_id;
                          const isCorrectAnswer = option.is_correct;
                          
                          let borderColor = 'border-gray-300 bg-gray-50';
                          let textColor = 'text-gray-700';
                          let badgeContent = null;
                          let iconElement = null;

                          if (isCorrectAnswer) {
                            borderColor = 'border-emerald-400 bg-emerald-100';
                            textColor = 'text-emerald-900';
                            iconElement = <CheckCircle className="w-3 h-3 text-emerald-600 flex-shrink-0" />;
                            badgeContent = (
                              <Badge variant="secondary" className="text-[10px] bg-emerald-600 text-white px-1 py-0 flex-shrink-0">
                                ✓ صحيح
                              </Badge>
                            );
                          }

                          if (isUserAnswer && !isCorrectAnswer) {
                            borderColor = 'border-red-400 bg-red-100';
                            textColor = 'text-red-900';
                            iconElement = <XCircle className="w-3 h-3 text-red-600 flex-shrink-0" />;
                            badgeContent = (
                              <Badge variant="destructive" className="text-[10px] px-1 py-0 flex-shrink-0">
                                ✗ خطأ
                              </Badge>
                            );
                          }

                          if (isUserAnswer && isCorrectAnswer) {
                            iconElement = <CheckCircle className="w-3 h-3 text-emerald-600 flex-shrink-0" />;
                            badgeContent = (
                              <Badge variant="secondary" className="text-[10px] bg-emerald-600 text-white px-1 py-0 flex-shrink-0">
                                ✓ صحيح
                              </Badge>
                            );
                          }

                          return (
                            <div
                              key={option.id}
                              className={`p-2 rounded border ${borderColor} mb-1 w-full max-w-full overflow-hidden`}
                            >
                              <div className="flex items-start justify-between gap-1 w-full">
                                <div className="flex items-start gap-1 flex-1 min-w-0 overflow-hidden">
                                  {iconElement || <span className="w-3 h-3 flex-shrink-0"></span>}
                                  <span className={`${textColor} text-xs break-words overflow-wrap-anywhere flex-1 leading-relaxed`}>
                                    {String.fromCharCode(65 + option.option_index)}) {option.option_text}
                                  </span>
                                </div>
                                <div className="flex-shrink-0">
                                  {badgeContent}
                                </div>
                              </div>
                            </div>
                          );
                        })}

                      {question?.explanation && (
                        <div className="bg-blue-50 border-r-2 border-blue-400 p-2 rounded mt-2 w-full max-w-full overflow-hidden">
                          <div className="flex items-start gap-1">
                            <Lightbulb className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                            <p className="text-blue-800 text-xs break-words overflow-wrap-anywhere flex-1 leading-relaxed">
                              <span className="font-bold">شرح: </span>
                              {question.explanation}
                            </p>
                          </div>
                        </div>
                      )}

                      {!userAnswer.is_correct && (
                        <div className="bg-yellow-50 border-r-2 border-yellow-400 p-2 rounded mt-2 w-full max-w-full overflow-hidden">
                          <div className="flex items-start gap-1">
                            <AlertCircle className="w-3 h-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <p className="text-yellow-800 text-xs break-words overflow-wrap-anywhere flex-1 leading-relaxed">
                              <span className="font-bold">نصيحة: </span>
                              راجع الموضوع لتحسين أدائك
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DetailedAnswerReview;