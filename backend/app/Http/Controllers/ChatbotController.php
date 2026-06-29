<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ChatbotController extends Controller
{
    private $responses = [
        "ازاي اسجل المواد" => "قم بتسجيل الدخول ومن الملف الشخصي قم بالضغط على تسجيل المقررات واختيار المواد التي ترغب في تسجيلها ومن ثم قم بطباعة الاستمارة والتوجه إلى خزينة الكلية.",
        "معلومات عن الكليه" => "يمكنك الاطلاع على جميع المعلومات من خلال صفحة عن الكلية.",
        "البريد الجامعي" => "من خلال صفحة الحصول على البريد الجامعي في القائمة الرئيسية.",
        "الحصول على الكتب" => "يمكنك الحصول على الكتب والمصادر الدراسية بعد تسجيل المقررات والدخول للملف الشخصي.",
        "المرشد الاكاديمي" => "يمكنك معرفة مرشدك الأكاديمي والتواصل معه من خلال لوحة التحكم الخاصة بك.",
        "الارشاد الاكاديمي" => "يمكنك الاستفادة من الإرشاد الأكاديمي عبر لوحة التحكم ومراجعة الساعات المعتمدة المتبقية والمتاحة لك.",
        "ازاى اتواصل مع مرشدي الاكاديمي" => "مرشدك الأكاديمي مسجل في صفحة الملف الشخصي بلوحة التحكم ومتاح للتواصل خلال الساعات المكتبية.",
        "الكتب الدراسيه" => "يمكنك الحصول على الكتب الإلكترونية والمحاضرات من خلال قسم 'المصادر الدراسية' في لوحة التحكم.",
        "مذاكرة المقررات" => "تتوفر ملفات المحاضرات والملخصات تحت قسم 'المصادر الدراسية' لكل مقرر مسجل.",
        "المعدل التراكمي" => "يمكنك استعراض معدلك التراكمي وتفاصيل درجاتك بالكامل من قسم 'المعدل التراكمي GPA' في لوحة التحكم.",
        "حساب الدرجات" => "يمكنك حساب المعدل المتوقع والمستهدف من خلال حاسبة GPA التفاعلية في لوحة التحكم.",
        "ازاى احسب درجاتي" => "استخدم حاسبة GPA التفاعلية المتاحة في لوحة التحكم لإدخال الدرجات المتوقعة وحساب معدلك الجديد.",
        "اختيار الاقسام" => "يمكنك التعرف على شروط وأقسام الكلية المتاحة (هندسة البرمجيات، النظم، إلخ) من خلال صفحة 'عن الكلية'.",
        "الجدول" => "جدولك الدراسي للمحاضرات والسكاشن متاح دائماً في قسم 'الجدول الدراسي' بلوحة التحكم.",
        "الجداول" => "جدولك الدراسي للمحاضرات والسكاشن متاح دائماً في قسم 'الجدول الدراسي' بلوحة التحكم.",
        "جدول المحاضرات" => "جدولك الدراسي للمحاضرات والسكاشن متاح دائماً في قسم 'الجدول الدراسي' بلوحة التحكم.",
        "أيام الحضور" => "تظهر أيام ومواعيد المحاضرات والسكاشن بوضوح في الجدول الدراسي الخاص بك داخل لوحة التحكم.",
        "حساب تقديري" => "قم بزيارة قسم 'المعدل التراكمي GPA' لاستخدام الحاسبة وتقدير معدلك الفصلي والتراكمي."
    ];

    public function reply(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:500',
        ]);

        $message = trim($request->input('message'));
        $lowerMsg = mb_strtolower($message);
        
        // Remove common punctuation for clean matching
        $cleanInput = str_replace(['؟', '?', '!', '.', '،', ' '], '', $lowerMsg);

        // check if english characters are present
        if (preg_match('/[a-zA-Z]/', $message)) {
            return response()->json([
                'response' => 'من فضلك اكتب سؤالك باللغة العربية فقط.'
            ]);
        }

        // check for greetings
        $greetings = ['انا', 'اهلا', 'مرحبا', 'ازاي', 'عامل ايه', 'هاي', 'سلام'];
        foreach ($greetings as $greet) {
            if (mb_strpos($lowerMsg, $greet) !== false && mb_strlen($lowerMsg) < 10) {
                return response()->json([
                    'response' => 'أهلاً بك! أنا مساعدك الأكاديمي الذكي (دليل Bot). كيف يمكنني مساعدتك اليوم؟'
                ]);
            }
        }

        // 1. Direct Substring Match (high reliability)
        foreach ($this->responses as $question => $answer) {
            $cleanQuestion = str_replace(['؟', '?', '!', '.', '،', ' '], '', mb_strtolower($question));
            if ($cleanQuestion !== '' && (mb_strpos($cleanInput, $cleanQuestion) !== false || mb_strpos($cleanQuestion, $cleanInput) !== false)) {
                return response()->json([
                    'response' => $answer
                ]);
            }
        }

        // 2. Levenshtein / Similarity match fallback
        $bestMatch = null;
        $highestSimilarity = 0;

        foreach ($this->responses as $question => $answer) {
            similar_text($lowerMsg, mb_strtolower($question), $percent);
            if ($percent > $highestSimilarity) {
                $highestSimilarity = $percent;
                $bestMatch = $answer;
            }
        }

        if ($highestSimilarity >= 40) {
            return response()->json([
                'response' => $bestMatch
            ]);
        }

        return response()->json([
            'response' => 'عذراً، لم أفهم استفسارك تماماً. هل يمكنك صياغته بشكل آخر؟ (مثال: "ازاي اسجل المواد؟" أو "الجدول الدراسي" أو "المعدل التراكمي")'
        ]);
    }
}
