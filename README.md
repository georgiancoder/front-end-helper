# ზოგადი აღწერა

პროგრამა უყურებს დირექტორიაში არსებულ ყველა html გაფართოვების ფაილს და უკეთებს მათ პარსირებას, რის შედეგადაც ქმნის json ობიექტების მასივს, რომელშიც თითოეული DOM ობიექტია თავისი ატრიბუტებით.
შემდგომ აკეთებს ყველა პარსირებული html დოკუმენტების მერჯინგს და შესაბამისად იქმნება 1 საერთო json ობიექტების მასივი სადაც თავმოყრილია ყველა html დოკუმენტში არსებული DOM ობიექტი ისე რომ არც-ერთი
ობიექტი არ მეორდება. ამის შემდეგ ხდება ამ DOM ობიექტების ატრიბუტების კოლაფსირება რაც საშუალებას გვაძლევს ერთი დონის DOM ელემენტების ატრიბუტები ორჯერ არ იყოს განმეორებადი. ამ ეტაპის დასრულების შემდეგ
ხდება DOM ელემენტების SCSS სტრუქტურაში კონვერტაცია და შედეგად იქმნება 1 main.scss ფაილი სადაც ხდება ამ სტრუქტურის ჩაწერა. მომხმარებელს პარალელურ რეჟიმში შეუძლია იმუშავოს როგორც html ფაილში ასევე main.scss ფაილში.
 იმ შემთხვევაში თუ main.scss ფაილი უკვე არსებობს და მომხმარებელს დაწყებული აქვს
მასში მუშაობა, ხდება ახალი დარენდერებული SCSS სტრუქტურის და უკვე არსებულის გადადარება, და ხდება ძველ ფაილზე მხოლოდ ახალი სტრუქტურის დამატება, იმ შემთხვევაში თუ მომხმარებელმა რომელიმე html ფაილიდან
წაშალა რაიმე ბლოკი, რომელიც არც ერთ დანარჩენ html ფაილში არ არსებობს ავტომატურად წაიშლება main.scss ფაილში sass სტრუქტურაც და ამასთანავე ის სტილებიც რაც უკვე ეწერა მომხმარებელს ამ სტრუქტურაში.
სისტემა უყურებს ყველა html დოკუმენტში მომხმარებლის მიერ შეტანილ ცვლილებას და შესაბამისად
იმეორებს ზემოთ ჩამოთვლილ ყველა მოქმედებას თანმიმდევრულად.