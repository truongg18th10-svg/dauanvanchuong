function checkQuiz() { const v = document.querySelector('input[name="quiz"]:checked'); const r = document.getElementById('quizResult'); if (!v) { r.textContent = 'Bạn hãy chọn một đáp án trước nhé.'; return } r.textContent = v.value === 'b' ? 'Chính xác! Văn chương mở rộng sự thấu cảm và giúp ta nhìn đời sống từ nhiều góc độ.' : 'Chưa đúng. Hãy thử nghĩ rộng hơn về những điều ta nhận được khi đọc một tác phẩm.' }
function showToast(t) { const el = document.getElementById('toast'); el.textContent = t; el.classList.add('show'); clearTimeout(window.toastTimer); window.toastTimer = setTimeout(() => el.classList.remove('show'), 3500) }
const REFLECTION_API_URL = 'https://script.google.com/macros/s/AKfycbxYMw-AJ3Ec793MU9-_s32kphC5T4VpgEddkcIQKdieCj3-tJwEsdGur-zWnYh3FNqg/exec';
function submitReflection(e) {
  e.preventDefault();
  const form = e.target, name = document.getElementById('reader').value.trim(), thought = document.getElementById('thought').value.trim(), website = document.getElementById('website').value;
  if (!name || !thought) { showToast('Vui lòng nhập tên và cảm nhận.'); return }
  if (REFLECTION_API_URL.includes('PASTE_YOUR_')) { showToast('Chức năng đang chờ quản trị viên cấu hình kết nối.'); return }
  const params = new URLSearchParams({ name, thought, website });
  const btn = form.querySelector('button[type="submit"]'); btn.disabled = true; btn.textContent = 'Đang gửi…';
  fetch(REFLECTION_API_URL, { method: 'POST', mode: 'no-cors', body: params })
    .then(() => { showToast('Cảm ơn ' + name + '! Cảm nhận đã được gửi và đang chờ duyệt.'); form.reset(); })
    .catch(() => showToast('Chưa gửi được. Vui lòng thử lại sau.'))
    .finally(() => { btn.disabled = false; btn.textContent = 'Gửi cảm nhận ↗' });
}
function loadApprovedReflections() {
  if (REFLECTION_API_URL.includes('PASTE_YOUR_') || window.USE_FIREBASE_REFLECTIONS) return;
  const cb = 'reflectionCallback_' + Date.now();
  window[cb] = data => {
    const root = document.getElementById('approvedReflections');
    if (!root) return;
    root.replaceChildren();
    if (!data.items || !data.items.length) { root.innerHTML = '<p style="color:var(--muted);font-size:15px">Chưa có cảm nhận được công khai.</p>'; return }
    data.items.forEach(item => { const article = document.createElement('article'); article.className = 'approved-item'; const title = document.createElement('strong'); title.textContent = item.name; const body = document.createElement('p'); body.textContent = item.thought; article.append(title, body); root.append(article) });
    delete window[cb]; script.remove();
  };
  const script = document.createElement('script'); script.src = REFLECTION_API_URL + '?callback=' + cb; script.onerror = () => { delete window[cb] }; document.body.append(script);
}
loadApprovedReflections();
document.querySelectorAll('.navlinks a').forEach(a => a.addEventListener('click', () => document.querySelector('.navlinks').classList.remove('open')));

(function () {
  const DATA = { "grades": { "6": [{ "title": "Thánh Gióng", "summary": "Truyền thuyết \"Thánh Gióng\" kể về người anh hùng chống giặc ngoại xâm vào đời Hùng Vương thứ sáu. Câu chuyện bắt đầu từ sự ra đời kì lạ của Gióng khi người mẹ thụ thai do ướm thử vào một vết chân khổng lồ, sinh ra cậu bé lên ba vẫn không biết nói, biết cười hay đi đứng. Khi giặc Ân ập đến, Gióng bỗng cất tiếng nói đầu tiên xin đi đánh giặc và yêu cầu vua rèn ngựa sắt, roi sắt cùng áo giáp sắt. Từ hôm đó, Gióng lớn nhanh như thổi nhờ sự đoàn kết góp gạo nuôi dưỡng của bà con dân làng. Lúc vũ khí được mang tới, Gióng vươn vai biến thành một tráng sĩ khổng lồ, dũng mãnh xông ra chiến trường. Ngay cả khi roi sắt gãy, tráng sĩ vẫn nhổ những cụm tre đằng ngà bên đường để quật tan quân thù. Dẹp xong giặc ngoại xâm, Gióng cởi bỏ áo giáp sắt, một mình một ngựa bay thẳng lên trời từ đỉnh núi Sóc, để lại tấm gương sáng ngời về lòng yêu nước và sức mạnh đại đoàn kết dân tộc được nhân dân ngàn đời thờ phụng, suy tôn là Phù Đổng Thiên Vương.", "hasRead": true }, { "title": "Sơn Tinh, Thủy Tinh", "summary": "Truyền thuyết \"Sơn Tinh, Thủy Tinh\" kể về cuộc kén rể của Hùng Vương thứ mười tám cho công chúa Mị Nương. Vì hai vị thần Sơn Tinh (chúa vùng non cao) và Thủy Tinh (chúa vùng nước thẳm) đều ngang tài ngang sức, vua Hùng đành ra điều kiện ai mang sính lễ quý hiếm đến trước sẽ được rước dâu. Hôm sau, Sơn Tinh mang sính lễ đến sớm nên cưới được Mị Nương. Thủy Tinh đến muộn, nổi trận lôi đình bèn hô mưa gọi gió, dâng nước dìm ngập nhà cửa để cướp lại công chúa. Nước dâng cao bao nhiêu, Sơn Tinh lại nâng núi đồi lên cao bấy nhiêu khiến Thủy Tinh kiệt sức đành chịu thua. Qua việc Thủy Tinh năm nào cũng dâng nước đánh ghen nhưng đều thất bại, tác phẩm giải thích hiện tượng bão lụt hàng năm ở nước ta, đồng thời ca ngợi sức mạnh và khát vọng chế ngự thiên nhiên của người Việt cổ.", "hasRead": true }, { "title": "Thạch Sanh", "summary": "Truyện cổ tích \"Thạch Sanh\" kể về người dũng sĩ mồ côi, hiền lành nhưng sở hữu võ nghệ và tài năng xuất chúng. Dù kết nghĩa anh em, Thạch Sanh liên tục bị kẻ xảo trá Lý Thông lừa gạt đi thế mạng, cướp công giết chằn tinh và cướp công cứu công chúa khỏi hang đại bàng. Khi bị hãm hại lấp cửa hang và sau đó bị giam dưới ngục tối, chàng đã gảy khúc đàn thần giúp công chúa khỏi bệnh câm, qua đó vạch trần toàn bộ tội ác của mẹ con Lý Thông. Cuối cùng, Thạch Sanh được minh oan, kết hôn cùng công chúa và dùng tiếng đàn yêu hòa bình cùng niêu cơm thần kì diệu để thu phục quân đội mười tám nước chư hầu. Tác phẩm ngợi ca vẻ đẹp sức mạnh, lòng nhân đạo của người anh hùng dân gian, đồng thời thể hiện ước mơ ngàn đời của nhân dân về công lý: ở hiền gặp lành, cái thiện luôn chiến thắng cái ác.", "hasRead": true }, { "title": "Gió lạnh đầu mùa", "summary": "Truyện ngắn \"Gió lạnh đầu mùa\" của nhà văn Thạch Lam là một bức tranh ấm áp về tình người trỗi dậy giữa những ngày đông giá rét. Câu chuyện bắt đầu khi đợt gió lạnh đầu tiên tràn về, hai anh em Sơn và Lan được mẹ mặc cho những chiếc áo len, áo dạ thật ấm áp để ra ngoài chơi. Tại bãi đất trống, hai anh em bắt gặp bạn Hiên nhà nghèo đang đứng co ro, run rẩy trong manh áo rách tả tơi. Động lòng thương xót, Sơn và Lan đã lén về nhà lấy chiếc áo bông cũ của người em út đã mất đem tặng cho Hiên. Dù sau đó Sơn ch chợt lo sợ bị mẹ mắng nên cuống cuồng đi tìm Hiên để đòi lại, nhưng sự việc lại kết thúc vô cùng tốt đẹp khi mẹ Hiên chủ động mang áo đến trả. Không những không trách phạt các con, mẹ của Sơn còn thấu hiểu, cảm thông cho mẹ Hiên vay tiền đi may áo mới và âu yếm ôm hai anh em vào lòng. Tác phẩm diễn biến nhẹ nhàng, tinh tế, qua đó ngợi ca vẻ đẹp của tình bạn trẻ thơ trong sáng, đồng thời gửi gắm thông điệp sâu sắc về sự sẻ chia, đùm bọc và tình yêu thương vô tư giữa con người với con người.", "hasRead": true }, { "title": "Cô Tô", "summary": "Đoạn trích \"Cô Tô\" của nhà văn Nguyễn Tuân là một bức tranh thiên nhiên và sinh hoạt vô cùng tươi đẹp, tràn đầy sức sống của vùng biển đảo quê hương. Mở đầu tác phẩm, tác giả phác họa khung cảnh Cô Tô ngay sau trận bão thật trong trẻo, sáng sủa với bầu trời xanh ngắt, nước biển lam biếc và cây cối thêm xanh mượt. Nổi bật nhất trên nền bối cảnh ấy là cảnh mặt trời mọc trên biển được miêu tả hết sức tráng lệ, rực rỡ và kì vĩ, đẹp như một lòng đỏ trứng thiên nhiên đầy đặn nhô lên từ chiếc mâm bạc bao la. Không chỉ dừng lại ở vẻ đẹp thiên nhiên, ngòi bút của Nguyễn Tuân còn hướng đến cảnh sinh hoạt nhộn nhịp, tấp nập nhưng cũng rất đỗi thanh bình của người dân đảo quanh giếng nước ngọt, nơi những ngư dân đang hối hả chuẩn bị cho chuyến ra khơi mới. Bằng khả năng quan sát tinh tế cùng ngôn từ miêu tả điêu luyện, giàu hình ảnh, tác phẩm đã tôn vinh vẻ đẹp tinh khôi của biển đảo Cô Tô, đồng thời gắm gửi tình yêu quê hương, đất nước sâu nặng và niềm tự hào của tác giả về thiên nhiên cùng những người lao động bình dị.", "hasRead": true }, { "title": "Cây khế", "summary": "Truyện cổ tích \"Cây khế\" kể về bài học nhân quả đích đáng qua câu chuyện của hai anh em mồ côi có tính cách hoàn toàn trái ngược nhau. Khi cha mẹ qua đời, người anh tham lam, ích kỉ đã chiếm đoạt hết ruộng vườn, trâu bò, chỉ chia cho người em hiền lành, chăm chỉ một túp lều nát và cây khế ngọt trước nhà. Nhờ công chăm sóc của người em, cây khế ra quả sai trĩu cành, bỗng một hôm có con chim lạ đến ăn khế và hứa trả ơn bằng vàng với lời dặn \"may túi ba gang\". Nhờ thật thà làm theo đúng lời dặn, người em được chim đưa ra đảo lấy vàng và trở nên giàu có, sung túc. Thấy vậy, người anh sinh lòng đố kị, nài nỉ xin đổi cả gia tài của mình lấy cây khế của người em. Chim thần cũng đến ăn và hứa đưa đi lấy vàng, nhưng bản tính tham lam vô độ khiến người anh may một chiếc túi khổng lồ (chín gang/ mười hai gang) và cố nhét đầy vàng bạc. Trên đường bay về, vì túi vàng quá nặng lại gặp gió lớn, chim thần chao đảo, nghiêng cánh khiến người anh cùng toàn bộ số vàng rơi chìm nghỉm xuống biển sâu. Qua câu chuyện, tác giả dân gian đã thể hiện ước mơ về sự công bằng trong xã hội, đồng thời gửi gắm bài học nhân sinh sâu sắc: \"ở hiền gặp lành\", người hiền lành, lương thiện sẽ được đền đáp, còn kẻ tham lam, ích kỉ ắt sẽ chuốc lấy hậu quả bi thảm.", "hasRead": true }, { "title": "Cây tre Việt Nam", "summary": "", "hasRead": false }, { "title": "Cửu Long giang ta ơi", "summary": "", "hasRead": false }], "7": [{ "title": "Đi lấy mật", "summary": "Đoạn trích \"Đi lấy mật\" (trích tiểu thuyết \"Đất rừng phương Nam\" của nhà văn Đoàn Giỏi) kể về trải nghiệm mới mẻ của cậu bé An khi lần đầu tiên được theo tía nuôi và thằng Cò vào rừng U Minh đi \"ăn ong\" (thu hoạch mật ong). Trong chuyến đi, An được chiêm ngưỡng bức tranh thiên nhiên hoang sơ, trù phú và tràn đầy sức sống của núi rừng phương Nam với ánh nắng rực rỡ, bầy chim líu lo và hương hoa tràm ngây ngất trổ bông trắng xóa. Không chỉ say mê trước vẻ đẹp của đất trời, An còn đi từ ngạc nhiên này đến ngạc nhiên khác khi khám phá ra bí quyết \"gác kèo\" cho ong rừng về làm tổ vô cùng độc đáo và sáng tạo của người dân vùng U Minh – một kĩ năng tuyệt vời mà không nơi nào trên thế giới có được. Qua ngòi bút miêu tả sinh động, đoạn trích không chỉ vẽ nên vẻ đẹp kì thú của thiên nhiên rừng tràm mà còn ngợi ca sự khỏe khoắn, tài trí, am hiểu tự nhiên và lối sống phóng khoáng, chan hòa với thiên nhiên của con người lao động phương Nam.", "hasRead": true }, { "title": "Đồng dao mùa xuân", "summary": "Bài thơ \"Đồng dao mùa xuân\" của nhà thơ Nguyễn Khoa Điềm khắc họa hình ảnh xúc động và đẹp đẽ về người lính trẻ đã dâng trọn tuổi thanh xuân cho Tổ quốc. Câu chuyện thơ bắt đầu bằng hình ảnh một người lính bộ đội cụ Hồ hồn nhiên, chất phác, \"chưa một lần yêu\" đã mang ba lô lên đường ra trận giữa những năm tháng chiến tranh khốc liệt. Anh đã anh dũng hi sinh và ở lại mãi mãi nơi chiến trường Trường Sơn, gửi lại tuổi hai mươi tươi đẹp trên vách núi. Tuy không thể trở về, nhưng hình bóng, nụ cười và ngọn lửa lí tưởng của anh đã hòa vào thiên nhiên, cỏ cây, trở thành một \"mùa xuân\" vĩnh cửu trường tồn cùng đất nước. Bằng thể thơ bốn chữ mang âm điệu đồng dao mộc mạc, sâu lắng, tác phẩm là khúc tráng ca ngợi ca và tri ân sâu sắc thế hệ cha anh đã ngã xuống vì nền hòa bình dân tộc, đồng thời khẳng định sự bất tử của những người lính trong trái tim của mỗi người dân đất Việt.", "hasRead": true }, { "title": "Bồng chanh đỏ", "summary": "Truyện ngắn \"Bồng chanh đỏ\" của nhà văn Đỗ Chu là một câu chuyện tuổi thơ trong trẻo, mang đậm ý nghĩa giáo dục về tình yêu và sự tôn trọng đối với thiên nhiên. Tác phẩm xoay quanh việc hai anh em Hiền và Hoài tình cờ phát hiện một đôi chim bồng chanh đỏ vô cùng tuyệt đẹp và quý hiếm đến làm tổ ở đầm sen của làng. Ban đầu, vì quá say mê và muốn sở hữu, người anh là Hiền đã rủ em trai ra đầm bắt chim về nuôi. Tuy nhiên, trước tình cảm gắn bó của đôi chim và vẻ đẹp của chúng trong môi trường tự nhiên, hai anh em đã thức tỉnh, dẹp bỏ mong muốn ích kỉ để giữ gìn sự bình yên cho tổ chim. Dù sau đó gia đình bồng chanh đỏ đã bay đi nơi khác làm tổ, nhưng chúng đã để lại trong tâm hồn hai đứa trẻ những kí ức tuyệt đẹp. Qua đó, tác phẩm nhẹ nhàng gửi gắm thông điệp sâu sắc: muôn loài chỉ thực sự rực rỡ và hạnh phúc nhất khi được sống tự do giữa thiên nhiên, và con người cần biết yêu thương, bảo vệ thế giới tự nhiên quanh mình.", "hasRead": true }, { "title": "Gặp lá cơm nếp", "summary": "Bài thơ \"Gặp lá cơm nếp\" của nhà thơ Thanh Thảo là một tác phẩm đầy xúc động viết về tình cảm gia đình thiêng liêng hòa quyện cùng tình yêu quê hương, đất nước. Câu chuyện thơ bắt đầu khi trên tuyến đường hành quân ra mặt trận đầy gian khổ, người lính trẻ tình cờ ngửi thấy mùi hương quen thuộc của lá cơm nếp. Hương vị mộc mạc ấy ngay lập tức đánh thức trong anh những kí ức tuổi thơ êm đềm và nỗi nhớ da diết về người mẹ hiền tần tảo, chắt chiu từng cành củi, chiếc lá để nấu nồi cơm nếp thơm lừng nuôi con khôn lớn. Trong trái tim người lính, nỗi nhớ mẹ và nỗi nhớ đất nước đan xen, hòa làm một, biến thành động lực to lớn thôi thúc anh kiên cường cầm súng chiến đấu bảo vệ bình yên cho tổ quốc. Bằng thể thơ năm chữ nhịp nhàng, ngôn ngữ giản dị và cảm xúc chân thành, tác phẩm đã khắc họa sâu sắc vẻ đẹp tâm hồn của người lính Cách mạng, qua đó khẳng định tình mẫu tử chính là điểm tựa tinh thần, là cội nguồn thiêng liêng của tình yêu Tổ quốc.", "hasRead": true }, { "title": "Vừa nhắm mắt vừa mở cửa sổ", "summary": "Đoạn trích \"Vừa nhắm mắt vừa mở cửa sổ\" của nhà văn Nguyễn Ngọc Thuần là một câu chuyện nhẹ nhàng, trong trẻo về tình yêu thiên nhiên và những bài học giáo dục sâu sắc từ người cha. Câu chuyện xoay quanh những trò chơi thú vị trong khu vườn nhỏ, khi người cha dạy cậu bé cách nhắm mắt lại để chạm, ngửi và đoán đúng tên từng loài hoa, hay lắng nghe âm thanh để đoán khoảng cách. Qua những trải nghiệm tưởng chừng đơn giản ấy, cậu bé đã rèn luyện được sự tinh tế của các giác quan và quan trọng hơn là học được cách cảm nhận vạn vật bằng cả trái tim. Không chỉ vậy, tác phẩm còn lồng ghép những bài học ý nghĩa về cách cho và nhận quà, cũng như cách thấu hiểu, yêu thương một ai đó từ việc gọi tên họ. Bằng giọng văn hồn nhiên, giàu chất thơ, đoạn trích đã gửi gắm thông điệp sâu sắc: hãy luôn \"nhắm mắt\" để tập trung cảm nhận và \"mở cửa sổ\" tâm hồn để đón nhận, trân trọng những vẻ đẹp bình dị cùng tình yêu thương trong cuộc sống.", "hasRead": true }, { "title": "Quê hương", "summary": "Bài thơ \"Quê hương\" của nhà thơ Tế Hanh là một bức tranh tươi sáng, sinh động và đầy ắp hơi thở lao động của một làng chài ven biển. Tác phẩm mở ra với khung cảnh vươn khơi đầy hứng khởi trong một buổi sáng tinh khôi, ở đó, chiếc thuyền như một con tuấn mã dũng mãnh chồm lên sóng lớn, còn những chàng trai chài lưới thì tràn đầy sinh lực và khát vọng. Không khí nhịp nhàng ấy càng trở nên náo nức, tấp nập hơn trong cảnh đón thuyền trở về bến với những khoang cá đầy ắp, làm nổi bật vẻ đẹp gân guốc, khỏe khoắn thấm đẫm \"vị xa xăm\" của người lao động và sự bình yên của con thuyền nằm \"nghe chất muối thấm dần trong thớ vỏ\" sau chuyến đi dài. Khép lại bài thơ là nỗi nhớ da diết, khôn nguôi của người con xa quê, nhớ từ màu nước xanh, con cá bạc, chiếc buồm vôi cho đến \"mùi mặn nồng\" vô hình mà trĩu nặng ân tình. Bằng hình ảnh thơ mộc mạc, lãng mạn cùng cảm xúc chân thành, tác phẩm đã gửi gắm tình yêu quê hương thiết tha, trong sáng và sự gắn bó máu thịt của nhà thơ với mảnh đất chôn nhau cắt rốn.", "hasRead": true }, { "title": "Gò Me", "summary": "Bài thơ \"Gò Me\" của nhà thơ Hoàng Tố Nguyên là bức tranh thiên nhiên và con người miền Nam tuyệt đẹp được tái hiện qua nỗi nhớ da diết của một người con xa xứ. Bằng những vần thơ dạt dào cảm xúc, tác giả đã vẽ nên khung cảnh quê hương Gò Me mang đậm dấu ấn Nam Bộ với con đê cát đỏ, những rặng me non, ánh nắng chói lọi, vầng trăng sáng trong cùng âm thanh quen thuộc của tiếng chim cu gáy, tiếng tre lá rì rào. Nổi bật trên nền thiên nhiên thanh bình, thơ mộng ấy là hình ảnh những con người Gò Me hiền hòa, cần cù và duyên dáng: từ người mẹ tần tảo sớm hôm đến những cô gái miệt vườn mộc mạc cất cao điệu hò thiết tha. Qua ngôn từ bình dị, nhịp điệu sinh động cùng nhiều hình ảnh tu từ đặc sắc, tác phẩm không chỉ tôn vinh vẻ đẹp trù phú, yên ả của mảnh đất Nam Bộ mà còn khắc sâu tình yêu, niềm tự hào và nỗi nhớ thương quê hương khôn nguôi của tác giả.", "hasRead": true }, { "title": "Mùa xuân nho nhỏ", "summary": "", "hasRead": false }], "8": [{ "title": "Lá cờ thêu sáu chữ vàng", "summary": "Tác phẩm \"Lá cờ thêu sáu chữ vàng\" của nhà văn Nguyễn Huy Tưởng là một khúc tráng ca lịch sử hào hùng kể về tấm gương tuổi trẻ yêu nước Trần Quốc Toản trong bối cảnh cuộc kháng chiến chống quân Nguyên Mông. Câu chuyện bắt đầu từ sự kiện nhà vua mở hội nghị Bình Than để bàn kế sách đánh giặc, nhưng vì Quốc Toản còn quá nhỏ nên không được cho vào dự bàn việc nước. Sự uất ức vì chưa thể góp sức cứu nguy cho dân tộc cùng lòng căm thù giặc sục sôi đã khiến chàng thiếu niên bóp nát quả cam vua ban trên tay lúc nào không hay. Không bỏ cuộc, Quốc Toản trở về quê nhà, tự mình chiêu mộ hàng trăm gia nô và thanh niên trai tráng, ngày đêm rèn luyện võ nghệ, sắm sửa vũ khí và giương cao lá cờ thêu sáu chữ vàng rực rỡ: \"Phá cường địch, báo hoàng ân\" (Phá giặc mạnh, đền ơn vua). Đội quân thiếu niên dũng cảm ấy đã sát cánh cùng quân chủ lực nhà Trần xông pha bao trận mạc, lập nên nhiều chiến công hiển hách khiến kẻ thù khiếp sợ. Qua hình tượng người anh hùng nhỏ tuổi Trần Quốc Toản, tác phẩm đã khắc họa thành công và ngợi ca tinh thần yêu nước nồng nàn, ý chí quật cường cùng sức mạnh đại đoàn kết của toàn dân tộc Việt Nam trước họa ngoại xâm.", "hasRead": true }, { "title": "Quang Trung đại phá quân Thanh", "summary": "Đoạn trích \"Quang Trung đại phá quân Thanh\" (trích Hoàng Lê nhất thống chí của Ngô gia văn phái) tái hiện lại chiến công oanh liệt, thần tốc đánh đuổi giặc ngoại xâm của nghĩa quân Tây Sơn. Nhận được tin 29 vạn quân Thanh do Tôn Sĩ Nghị chỉ huy tràn sang chiếm đóng Thăng Long, Nguyễn Huệ lập tức lên ngôi Hoàng đế, lấy niên hiệu là Quang Trung và nhanh chóng thống lĩnh đại quân tiến ra Bắc. Trên đường đi, ông chiêu mộ thêm lực lượng, tổ chức duyệt binh, đọc hịch phủ dụ tướng sĩ để khơi dậy lòng yêu nước và vạch ra kế hoạch tác chiến vô cùng sắc bén. Bằng tài cầm quân kiệt xuất, Quang Trung đã chỉ huy đạo quân hành quân thần tốc, đánh những đòn bất ngờ, liên tiếp hạ gục các đồn Hà Hồi, Ngọc Hồi và tiến vào giải phóng Thăng Long ngay trong mùng 5 Tết, sớm hơn cả kế hoạch dự kiến. Trận đánh vang dội đã khiến tướng nhà Thanh là Tôn Sĩ Nghị hoảng loạn vứt bỏ cả ấn tín chạy trối chết về nước, còn vua tôi Lê Chiêu Thống cũng phải chịu cảnh tháo chạy nhục nhã. Đoạn trích đã khắc họa vô cùng chân thực, sinh động hình tượng người anh hùng dân tộc Nguyễn Huệ quả quyết, trí dũng song toàn, đồng thời phơi bày bản chất hèn nhát, thảm bại của kẻ thù xâm lược và bè lũ bán nước cầu vinh.", "hasRead": true }, { "title": "Thu điếu", "summary": "Bài thơ \"Thu điếu\" (Câu cá mùa thu) của Nguyễn Khuyến là một bức tranh thiên nhiên tuyệt đẹp, thanh bình về mùa thu ở vùng đồng bằng Bắc Bộ, đồng thời gửi gắm tâm sự thầm kín của nhà thơ. Bức tranh cảnh thu được phác họa bằng những nét vẽ tinh tế, không gian thu nhỏ hẹp nhưng có chiều sâu với ao thu lạnh lẽo, nước trong veo, chiếc thuyền câu bé tẻo teo cùng những chuyển động rất nhẹ của làn sóng biếc, chiếc lá vàng bay trong gió và ngõ trúc quanh co vắng lặng. Cảnh vật hiện lên vô cùng trong trẻo, tĩnh lặng nhưng lại phảng phất nỗi buồn hắt hiu. Ở trung tâm bức tranh ấy là hình ảnh thi nhân đang \"tựa gối buông cần\", người ngồi câu cá nhưng thực chất là đang chìm đắm trong những suy tư muộn phiền. Bằng nghệ thuật gieo vần \"eo\" thần tình cùng ngôn từ giản dị, tác phẩm không chỉ ca ngợi vẻ đẹp thiên nhiên quê hương mà còn bộc lộ tâm thế thanh cao, tình yêu nước thầm kín cùng nỗi đau đáu về thời thế của một nhà nho nặng lòng với dân tộc nhưng đành bất lực chọn lối sống lánh đục về trong.", "hasRead": true }, { "title": "Thiên Trường vãn vọng", "summary": "Bài thơ \"Thiên Trường vãn vọng\" (Buổi chiều đứng ở phủ Thiên Trường trông ra) của Trần Nhân Tông là một bức tranh thiên nhiên và sinh hoạt làng quê thanh bình, thơ mộng lúc chiều tà. Mở đầu tác phẩm, cảnh sắc hoàng hôn hiện lên mơ màng, huyền ảo với sương khói nhạt nhòa bao phủ khắp các thôn xóm trước sau, khiến cảnh vật chìm trong ánh nắng nhạt nửa như có nửa như không. Trên nền cảnh êm ả ấy, nét vẽ sinh hoạt hiện lên thật mộc mạc, gần gũi qua âm thanh tiếng sáo của những chú bé mục đồng đang lùa trâu về chuồng và hình ảnh từng đôi cò trắng nhẹ nhàng hạ cánh xuống đồng lúa. Bằng bút pháp chấm phá tinh tế và ngôn ngữ cô đọng, tác phẩm không chỉ vẽ nên vẻ đẹp êm đềm, tĩnh lặng của vùng quê Thiên Trường mà còn thể hiện tình yêu thiên nhiên, sự gắn bó máu thịt với đời sống thôn dã cùng tâm hồn bình dị, thanh cao của một vị vua anh minh, thiền vị.", "hasRead": true }, { "title": "Hịch tướng sĩ", "summary": "Bài \"Hịch tướng sĩ\" của Trần Quốc Tuấn là một áng thiên cổ hùng văn phản ánh chân thực tinh thần yêu nước và ý chí quyết chiến quyết thắng của dân tộc ta trước nguy cơ quân Mông – Nguyên lăm le xâm lược. Mở đầu tác phẩm, tác giả lột tả sự ngang ngược, tham tàn của sứ giặc, qua đó bày tỏ nỗi căm phẫn sục sôi đến mức quên ăn mất ngủ và tấm lòng sẵn sàng xả thân cứu nước của người làm tướng. Từ tình cảm mãnh liệt ấy, Trần Quốc Tuấn vừa ân cần phân tích ân nghĩa chủ tướng, vừa nghiêm khắc phê phán lối sống lơ là, chểnh mảng, chỉ lo vun vén hạnh phúc cá nhân và ham mê những thú vui tầm thường của các tì tướng. Ông vạch rõ ranh giới giữa sự sống và cái chết, giữa vinh và nhục, để rồi dóng lên hồi chuông cảnh tỉnh, kêu gọi toàn quân phải biết xót xa trước vận mệnh đất nước, đề cao tinh thần cảnh giác và tích cực rèn luyện \"Binh thư yếu lược\". Bằng nghệ thuật lập luận chặt chẽ, lí lẽ sắc bén, lời văn biền ngẫu giàu hình ảnh và dạt dào cảm xúc, tác phẩm đã khơi dậy mạnh mẽ lòng tự trọng, sự căm thù giặc và tinh thần đoàn kết, quyết tâm đánh giặc giữ nước của toàn thể quân dân nhà Trần.", "hasRead": true }, { "title": "Tinh thần yêu nước của nhân dân ta", "summary": "Văn bản \"Tinh thần yêu nước của nhân dân ta\" của Chủ tịch Hồ Chí Minh là một bài văn nghị luận xuất sắc, khẳng định mạnh mẽ truyền thống yêu nước nồng nàn và quý báu của dân tộc Việt Nam. Mở đầu, tác giả nêu bật luận điểm cốt lõi bằng hình ảnh so sánh vô cùng sinh động: lòng yêu nước kết thành một làn sóng vô cùng mạnh mẽ, to lớn, lướt qua mọi sự nguy hiểm, khó khăn và nhấn chìm tất cả lũ bán nước, cướp nước. Để làm sáng tỏ nhận định này, Bác đã đưa ra những dẫn chứng lịch sử hào hùng qua các thời kì của Bà Trưng, Bà Triệu, Trần Hưng Đạo, Lê Lợi, Quang Trung... đồng thời liệt kê những hành động yêu nước đa dạng của đồng bào ta trong cuộc kháng chiến hiện tại, từ người già đến trẻ nhỏ, từ tiền tuyến đến hậu phương. Cuối cùng, bằng cách ví lòng yêu nước như \"những thứ của quý\" có thể trưng bày hoặc cất giấu kín đáo, tác giả nhấn mạnh nhiệm vụ của Đảng và nhân dân ta là phải ra sức tuyên truyền, tổ chức, lãnh đạo để khơi dậy, phát huy sức mạnh to lớn ấy vào công cuộc kháng chiến kiến quốc. Bằng lập luận chặt chẽ, dẫn chứng toàn diện, tiêu biểu cùng giọng văn hào hùng, thiết tha, tác phẩm đã khơi dậy niềm tự hào dân tộc và ý thức trách nhiệm của mỗi con người đối với đất nước.", "hasRead": true }, { "title": "Nam quốc sơn hà", "summary": "Bài thơ thất ngôn tứ tuyệt \"Nam quốc sơn hà\" (Sông núi nước Nam) – tương truyền của danh tướng Lý Thường Kiệt – được xem là bản Tuyên ngôn Độc lập đầu tiên của dân tộc Việt Nam. Mở đầu tác phẩm, tác giả đã khẳng định một cách đanh thép, hùng hồn về chủ quyền lãnh thổ thiêng liêng, bất khả xâm phạm của đất nước: nước Nam là của người Nam, điều đó đã được phân định rành rành trong sách trời như một chân lý bất biến. Tiếp nối mạch cảm xúc ấy, hai câu thơ cuối cất lên lời chất vấn đầy phẫn nộ trước hành động phi nghĩa của kẻ thù xâm lược, đồng thời giáng một lời cảnh báo đanh thép về thất bại thảm hại tất yếu đang chờ đón chúng. Bằng giọng thơ trang trọng, hào sảng cùng lập luận chặt chẽ, sắc bén, bài thơ đã kết tinh sâu sắc lòng yêu nước, niềm tự hào dân tộc và ý chí quyết tâm bảo vệ nền độc lập, tự chủ của nhân dân ta trước mọi thế lực ngoại bang.", "hasRead": true }, { "title": "Lai Tân", "summary": "Bài thơ \"Lai Tân\" (trích tập \"Nhật ký trong tù\" của Hồ Chí Minh) là một tác phẩm trào phúng đặc sắc, phơi bày bộ máy quan lại thối nát ở huyện Lai Tân, Trung Quốc dưới thời Tưởng Giới Thạch. Qua ba câu thơ đầu, tác giả lần lượt vạch trần hiện thực mục ruỗng của những kẻ đứng đầu bộ máy cai trị địa phương: ban trưởng nhà lao thì chuyên đánh bạc, cảnh trưởng ngang nhiên ăn tiền đút lót của phạm nhân, còn huyện trưởng lại chong đèn làm việc công đầy mờ ám. Trớ trêu thay, khép lại hàng loạt hành vi phạm pháp và vô trách nhiệm ấy là câu thơ kết tưởng chừng bình thản nhưng đầy mỉa mai khi khẳng định trời đất Lai Tân vẫn \"thái bình\". Bằng thể thơ thất ngôn tứ tuyệt hàm súc cùng giọng điệu tự nhiên, khách quan mà châm biếm sâu cay, bài thơ đã tạo nên tiếng cười đả kích sắc bén, qua đó tố cáo sự bất công, mục ruỗng đến mức trở thành quy luật hiển nhiên của xã hội đương thời.", "hasRead": true }, { "title": "Lặng lẽ Sa Pa", "summary": "Đoạn trích \"Lặng lẽ Sa Pa\" của nhà văn Nguyễn Thành Long kể về cuộc gặp gỡ tình cờ nhưng đầy ý nghĩa giữa ông họa sĩ già, cô kĩ sư trẻ và anh thanh niên làm công tác khí tượng kiêm vật lí địa cầu trên đỉnh Yên Sơn cao hai nghìn sáu trăm mét. Qua lời giới thiệu của bác lái xe, trong vỏn vẹn ba mươi phút dừng chân tại trạm khí tượng, hai vị khách đã vô cùng bất ngờ trước cuộc sống ngăn nắp, rực rỡ sắc hoa, đầy ắp sách hay cùng tinh thần làm việc nghiêm túc, say mê của anh thanh niên giữa nơi núi rừng vắng vẻ. Không chỉ cởi mở chia sẻ về công việc \"đo gió, đo mưa, đo nắng, tính mây, đo chấn động mặt đất\" đầy gian khổ nhưng hạnh phúc của mình, anh còn khiêm tốn nhắc đến những con người cống hiến thầm lặng khác như ông kĩ sư ở vườn rau Sa Pa hay anh cán bộ nghiên cứu bản đồ sét. Cuộc trò chuyện ngắn ngủi ấy đã để lại dư âm sâu sắc, tiếp thêm niềm tin, lẽ sống cho cô kĩ sư trẻ trên chặng đường nhận công tác mới ở Lai Châu và khơi nguồn cảm hứng sáng tạo nghệ thuật mãnh liệt cho người họa sĩ già. Bằng cốt truyện nhẹ nhàng, ngôn ngữ giàu chất thơ cùng nghệ thuật khắc họa nhân vật tinh tế, tác phẩm đã ngợi ca vẻ đẹp của những người lao động bình dị mà cao quý, âm thầm dâng hiến tuổi xuân và trí tuệ cho đất nước đằng sau vẻ lặng lẽ của thiên nhiên Sa Pa.", "hasRead": true }, { "title": "Bếp lửa", "summary": "Bài thơ \"Bếp lửa\" của nhà thơ Bằng Việt là khúc ca đầy xúc động về tình bà cháu thiêng liêng, sâu nặng qua dòng hồi tưởng của người cháu khi đã trưởng thành và ở nơi phương xa. Bắt đầu từ hình ảnh bếp lửa quen thuộc chờn vờn trong sương sớm, mạch cảm xúc của tác giả ngược dòng thời gian trở về với những năm tháng tuổi thơ đầy gian khổ nhưng luôn ấm áp tình thương bên người bà tần tảo. Đó là kỉ niệm về nạn đói năm 1945 mờ mịt khói, tiếng chim tu hú khắc khoải trên những cánh đồng xa và cả những năm tháng kháng chiến khốc liệt khi giặc đốt làng, bà vẫn một lòng vững chãi, lặng lẽ gánh vác mọi nhọc nhằn để nuôi dạy cháu khôn lớn, làm hậu phương bình yên cho con cái công tác. Qua dòng suy ngẫm của người cháu, bếp lửa bình dị mà bà nhen nhóm mỗi sớm mai không chỉ sưởi ấm cái lạnh của đất trời mà còn trở thành biểu tượng cho ngọn lửa của sự sống, niềm tin và tình yêu thương bất diệt. Bằng giọng thơ tâm tình, sâu lắng cùng sự kết hợp nhuần nhuyễn giữa biểu cảm, miêu tả và tự sự, tác phẩm đã khắc họa thành công vẻ đẹp giàu đức hi sinh của người phụ nữ Việt Nam, đồng thời gửi gắm thông điệp sâu sắc về lòng biết ơn cội nguồn, gia đình và tình yêu quê hương, đất nước.", "hasRead": true }, { "title": "Lá đỏ", "summary": "Bài thơ \"Lá đỏ\" của nhà thơ Nguyễn Đình Thi tái hiện lại khoảnh khắc gặp gỡ ngắn ngủi nhưng đầy xúc động trên tuyến đường Trường Sơn lịch sử trong những ngày cả nước dồn sức cho cuộc Tổng tiến công giải phóng miền Nam. Tác phẩm mở ra khung cảnh núi rừng Trường Sơn hùng vĩ, lãng mạn mà khốc liệt với hình ảnh \"rừng lạ ào ào lá đỏ\" hòa cùng bụi đường và bước chân hành quân thần tốc của đoàn quân ra trận. Nổi bật giữa không gian ấy là hình ảnh \"em gái tiền phương\" – cô thanh niên xung phong đứng bên đường làm nhiệm vụ trong tư thế hiên ngang, giản dị với chiếc vai áo bạc quàng súng trường, hiện lên thân thương và thiêng liêng \"như quê hương\". Cuộc chạm mặt giữa người lính và cô gái diễn ra thật vội vã trong tiếng cười nói rộn rã của đoàn quân, để rồi khép lại bằng lời hẹn ước đầy lạc quan và niềm tin tất thắng: \"Hẹn gặp nhé giữa Sài Gòn\". Bằng thể thơ tự do cô đọng, giàu nhạc điệu cùng những hình ảnh vừa chân thực vừa lãng mạn, tác phẩm đã ngợi ca vẻ đẹp kiên cường, lạc quan của những người lính và lực lượng thanh niên xung phong trên tuyến lửa Trường Sơn, đồng thời thể hiện khát vọng thống nhất đất nước mãnh liệt của cả dân tộc.", "hasRead": true }, { "title": "Những ngôi sao xa xôi", "summary": "Truyện ngắn \"Những ngôi sao xa xôi\" của nhà văn Lê Minh Khuê kể về cuộc sống và chiến đấu của ba nữ thanh niên xung phong thuộc tổ trinh sát mặt đường trên một cao điểm đầy bom đạn ở tuyến đường Trường Sơn thời kháng chiến chống Mỹ, gồm Phương Định, Nho và chị Thao. Công việc hằng ngày của họ vô cùng nguy hiểm khi phải chạy trên cao điểm giữa ban ngày để đo khối lượng đất đá lấp hố bom, đánh dấu và phá những quả bom chưa nổ, luôn đối mặt trực tiếp với cái chết. Thế nhưng, vượt lên trên sự khốc liệt của chiến tranh, ba cô gái vẫn giữ trọn vẹn nét hồn nhiên, mơ mộng, nhạy cảm của tuổi trẻ cùng tình đồng đội gắn bó keo sơn, thể hiện rõ qua sự kiện Nho bị thương khi phá bom được hai người chị em tận tình chăm sóc hay khoảnh khắc cả ba vui sướng, bồi hồi đón cơn mưa đá bất chợt giữa núi rừng. Bằng nghệ thuật miêu tả tâm lí nhân vật tinh tế và giọng kể tự nhiên, chân thực, tác phẩm đã làm nổi bật vẻ đẹp tâm hồn trong sáng, lòng dũng cảm, tinh thần lạc quan cùng lí tưởng sống cao đẹp của thế hệ trẻ Việt Nam trong những năm tháng chiến tranh ác liệt.", "hasRead": true }], "9": [{ "title": "Chuyện người con gái Nam Xương", "summary": "\"Chuyện người con gái Nam Xương\" (trích Truyền kì mạn lục của Nguyễn Dữ) kể về cuộc đời đầy bi kịch của Vũ Thị Thiết (Vũ Nương) – một người phụ nữ xinh đẹp, thùy mị, nết na nhưng lại phải chịu nỗi oan khuất thấu trời. Kết hôn với Trương Sinh có tính đa nghi, lại sớm phải xa chồng đi lính, nàng ở nhà một mình sinh con, hết lòng phụng dưỡng mẹ chồng lúc ốm đau đến khi qua đời và thường chỉ bóng mình trên tường bảo là cha của bé Đản để dỗ dành con nhỏ. Ngày Trương Sinh trở về, chỉ vì câu nói ngây thơ của đứa trẻ, chàng đã mù quáng nghi ngờ vợ thất tiết, buông lời mắng nhiếc và đuổi nàng đi, khiến Vũ Nương uất ức gieo mình xuống sông Hoàng Giang tự vẫn. Về sau, trong một đêm ngồi bên ngọn đèn khuya, nghe bé Đản chỉ chiếc bóng trên vách gọi là cha, Trương Sinh mới vỡ lẽ nỗi oan của vợ nhưng mọi chuyện đã quá muộn; dù được Linh Phi cứu sống dưới thủy cung và hiện về rực rỡ giữa dòng Hoàng Giang trong lễ lập đàn giải oan, Vũ Nương vẫn nói lời tạ từ và vĩnh viễn không thể trở về nhân gian. Bằng nghệ thuật xây dựng tình huống thắt nút, mở nút khéo léo kết hợp với các yếu tố kì ảo đặc sắc, tác phẩm không chỉ ngợi ca vẻ đẹp tâm hồn, đức hạnh của người phụ nữ Việt Nam truyền thống mà còn lên án xã hội phong kiến nam quyền bất công cùng chiến tranh phi nghĩa đã đẩy con người vào bi kịch.", "hasRead": true }, { "title": "Sơn Tinh, Thủy Tinh", "summary": "Bài thơ \"Sơn Tinh, Thủy Tinh\" của nhà thơ Nguyễn Nhược Pháp (trích tập Ngày xưa) đã kể lại câu chuyện truyền thuyết quen thuộc bằng góc nhìn thơ mới mẻ, hóm hỉnh và giàu chất trữ tình. Tác phẩm xoay quanh cuộc kén rể của vua Hùng Vương thứ mười tám cho nàng công chúa Mị Nương xinh đẹp tuyệt trần với hai vị thần tài giỏi ngang sức là Sơn Tinh – chúa vùng non cao và Thủy Tinh – chúa vùng biển cả. Sau màn trổ tài phép thuật kì ảo bất phân thắng bại, vua Hùng bèn phán rằng sáng hôm sau ai mang sính lễ đến trước sẽ được rước dâu. Kết quả, Sơn Tinh đến sớm và đón Mị Nương về núi Tản Viên trong nỗi quyến luyến, bịn rịn của nàng công chúa dành cho vua cha. Thủy Tinh đến muộn, ôm mối hận tình nên nổi giận dâng nước, hô mưa gọi gió và xua quân thủy tộc tấn công, nhưng Sơn Tinh vẫn điềm tĩnh nâng núi, dùng sấm sét đẩy lùi mọi đợt sóng dữ, khiến Thủy Tinh đành rút lui và hằng năm lại dâng nước báo thù trong bất lực. Bằng thể thơ tự do linh hoạt, ngôn từ giàu hình ảnh cùng giọng điệu tươi vui, trong trẻo, tác phẩm không chỉ ca ngợi sức mạnh chế ngự thiên nhiên của người Việt cổ mà còn thổi nét đẹp lãng mạn, đời thường và giàu cảm xúc vào các nhân vật huyền thoại.", "hasRead": true }, { "title": "Nỗi niềm chinh phụ", "summary": "Đoạn trích \"Nỗi niềm chinh phụ\" (trích Chinh phụ ngâm, nguyên tác chữ Hán của Đặng Trần Côn, bản diễn Nôm của Phan Huy Ích) khắc họa sâu sắc tâm trạng cô đơn, sầu muộn và nỗi nhớ nhung da diết của người vợ có chồng đi chinh chiến. Tác phẩm mở ra cảnh chia li đầy lưu luyến và cách trở khi người chồng lên đường ra chốn chiến trường mưa gió, còn người chinh phụ lặng lẽ trở về buồng cũ chiếu chăn, ngậm ngùi nhìn theo bóng người thương khuất dần sau ngàn dâu xanh ngắt và núi mây trùng điệp. Đối diện với không gian tĩnh mịch cùng thời gian trôi chậm chạp đằng đẵng như năm, nàng cố gượng đốt hương, soi gương, gảy đàn để khuây khỏa nỗi sầu nhưng càng làm dấy lên niềm xót xa, lo âu cho hạnh phúc lứa đôi. Nàng khao khát được gửi tấm lòng thủy chung theo ngọn gió đông tới tận biên ải xa xôi để sẻ chia cùng chồng, song tất cả chỉ rơi vào vô vọng giữa đất trời thăm thẳm và khung cảnh thiên nhiên u buồn, sương lạnh. Bằng thể thơ song thất lục bát giàu nhạc điệu cùng nghệ thuật tả cảnh ngụ tình đặc sắc, đoạn trích không chỉ lột tả chân thực bi kịch cô đơn của người phụ nữ trong chiến tranh mà còn thể hiện tiếng nói nhân đạo sâu sắc khi gián tiếp lên án chiến tranh phi nghĩa và trân trọng khát vọng hạnh phúc con người.", "hasRead": true }, { "title": "Tiếng đàn mưa", "summary": "Bài thơ \"Tiếng đàn mưa\" của nhà thơ Bích Khê là bức tranh thiên nhiên giàu nhạc tính, thấm đẫm nỗi buồn cô đơn và tâm sự hoài hương sâu lắng của người lữ khách xa xứ. Mở đầu tác phẩm, không gian hiện lên mênh mang, trầm lắng với những cơn mưa xuân rơi rả rích khắp chốn, từ lầu cao, thềm lan đến nẻo dặm ngàn, kéo theo cánh hoa xuân tàn rụng và bóng chiều tà dần tắt. Tiếng mưa rơi đều đặn, triền miên ấy được nhà thơ liên tưởng tinh tế như một bản đàn buồn bất tận của đất trời. Càng về cuối bài thơ, tiếng mưa ngoài cảnh vật dần thấm sâu vào thế giới nội tâm, hòa quyện với \"muôn hàng lệ rơi\" của người \"khách tha hương\" đang trĩu nặng nỗi sầu muộn giữa chốn đất khách. Bằng thể thơ song thất lục bát truyền thống kết hợp cùng nghệ thuật điệp từ, ngôn ngữ giàu chất nhạc và bút pháp tả cảnh ngụ tình đặc sắc, tác phẩm không chỉ khắc họa thành công vẻ đẹp u buồn của mưa xuân mà còn bộc lộ nỗi nhớ quê hương da diết cùng tâm sự yêu nước kín đáo của tác giả.", "hasRead": true }, { "title": "Kim Kiều gặp gỡ", "summary": "Đoạn trích \"Kim Kiều gặp gỡ\" (trích Truyện Kiều của đại thi hào Nguyễn Du) tái hiện cuộc hội ngộ định mệnh đầy thơ mộng giữa Thúy Kiều và Kim Trọng vào buổi chiều tà sau lễ tảo mộ tiết Thanh minh. Trên đường du xuân trở về bên dòng suối nhỏ uốn quanh nhịp cầu, chị em Kiều tình cờ bắt gặp Kim Trọng – một chàng thư sinh phong độ, hào hoa, vốn là bạn đồng môn của Vương Quan và đã thầm mến tài sắc hai nàng từ lâu. Giữa khung cảnh thiên nhiên chiều xuân êm đềm, trang nhã, cuộc gặp gỡ diễn ra thật lễ độ nhưng cũng đầy xao xuyến, khiến hai trái tim trẻ trung lập tức rung động bởi mối tình đầu trong sáng (\"tình trong như đã mặt ngoài còn e\"). Đến lúc chia tay, cả Kim Trọng lẫn Thúy Kiều đều mang nặng nỗi bâng khuâng, lưu luyến, ánh mắt ngẩn ngơ dõi theo nhau bên rặng tơ liễu như báo hiệu một mối lương duyên sâu nặng. Bằng bút pháp tả cảnh ngụ tình điêu luyện cùng ngôn ngữ trau chuốt, giàu sức gợi, Nguyễn Du đã khắc họa thành công vẻ đẹp của con người và tình yêu đôi lứa tự do, say đắm ngay từ cái nhìn đầu tiên.", "hasRead": true }, { "title": "Lục Vân Tiên đánh cướp, cứu Kiều Nguyệt Nga", "summary": "Đoạn trích \"Lục Vân Tiên đánh cướp, cứu Kiều Nguyệt Nga\" (trích Truyện Lục Vân Tiên của nhà thơ Nguyễn Đình Chiểu) kể về cuộc gặp gỡ định mệnh và hành động trượng nghĩa của chàng trai trẻ Lục Vân Tiên. Trên đường trở về thăm nhà để chuẩn bị lên kinh ứng thí, bắt gặp bọn cướp Phong Lai đang hung hãn hoành hành, bắt bớ dân lành và giam giữ tiểu thư Kiều Nguyệt Nga cùng người hầu Kim Liên, Vân Tiên đã không chút do dự bẻ cây bên đường làm gậy, một mình xông vào đánh tan lũ cướp và trừng trị tên đầu đảng Phong Lai. Sau khi giải vây, chàng ân cần hỏi thăm hai cô gái nhưng vẫn giữ đúng lễ giáo phong kiến khi khuyên Kiều Nguyệt Nga không cần bước ra khỏi xe để tạ lễ. Trước lòng biết ơn sâu sắc và lời mời về vùng Hà Khê để gia đình đền đáp của nàng, Vân Tiên đã thẳng thắn khước từ vì chàng quan niệm thấy việc nghĩa mà không làm thì không phải bậc anh hùng, giúp người hoàn toàn xuất phát từ tấm lòng vô tư, không màng danh lợi. Qua ngòi bút kể chuyện mộc mạc, giàu kịch tính, đoạn trích đã khắc họa thành công hình tượng người anh hùng Lục Vân Tiên tài năng, dũng cảm, trọng nghĩa khinh tài cùng vẻ đẹp nết na, trọng ân tình của Kiều Nguyệt Nga, qua đó gửi gắm khát vọng hành đạo giúp đời cao đẹp của tác giả.", "hasRead": true }, { "title": "Tự tình", "summary": "Bài thơ \"Tự tình\" (bài II) của nữ sĩ Hồ Xuân Hương là tiếng lòng đầy bi phẫn nhưng cũng chan chứa khát vọng sống, khát vọng hạnh phúc của người phụ nữ trong xã hội phong kiến xưa. Mở đầu tác phẩm, không gian đêm khuya tĩnh mịch với tiếng trống canh dồn dập càng tô đậm nỗi cô đơn, bẽ bàng của nhân vật trữ tình khi phải đối diện với cảnh \"trơ cái hồng nhan\" giữa nước non, mượn chén rượu giải sầu nhưng càng say lại càng tỉnh, nhìn vầng trăng sắp tàn mà vẫn \"khuyết chưa tròn\" như chính duyên phận lỡ làng của mình. Không cam chịu số phận hẩm hiu, nỗi uất ức ấy đã trỗi dậy mạnh mẽ qua bức tranh thiên nhiên đầy phẫn uất với những đám rêu \"xiên ngang mặt đất\", những hòn đá \"đâm toạc chân mây\", thể hiện bản lĩnh ngang tàng muốn phá tung mọi trói buộc của lễ giáo hà khắc. Thế nhưng, khép lại bài thơ vẫn là tiếng thở dài ngán ngẩm trước quy luật nghiệt ngã của thời gian khi tuổi xuân trôi đi mà không trở lại, để rồi người phụ nữ đành ngậm ngùi đối diện với \"mảnh tình san sẻ tí con con\" đầy chua xót. Bằng ngôn ngữ thơ Nôm giản dị mà điêu luyện cùng hệ thống động từ mạnh và hình ảnh giàu sức gợi, tác phẩm vừa bộc lộ niềm cảm thương sâu sắc cho thân phận người phụ nữ đa đoan, vừa ngợi ca sức sống mãnh liệt và khát khao vươn tới hạnh phúc trọn vẹn của con người.", "hasRead": true }, { "title": "Tiếng Việt", "summary": "Bài thơ \"Tiếng Việt\" của nhà thơ Lưu Quang Vũ là khúc ca thiết tha, sâu lắng ngợi ca vẻ đẹp và sức sống trường tồn của tiếng mẹ đẻ. Mở đầu tác phẩm, tác giả gợi lên nguồn cội lâu đời cùng sự giàu có, tinh tế của tiếng Việt – thứ ngôn ngữ giàu thanh điệu, êm ái như lời ru, ngân vang như tiếng sáo trúc và gợi hình, gợi cảm như một bức tranh sống động. Không chỉ đẹp về âm thanh, tiếng Việt còn gắn bó máu thịt với đời sống lao động cần cù, những vui buồn, sướng khổ của nhân dân qua bao thế hệ và là sợi dây thiêng liêng kết nối những người con xa xứ với cội nguồn quê hương. Trải qua bao thăng trầm lịch sử và khói lửa chiến tranh, tiếng Việt vẫn bền bỉ, kiên cường, không ngừng lớn mạnh cùng vận mệnh của dân tộc. Bằng thể thơ tự do giàu nhạc điệu, giọng thơ trữ tình tha thiết cùng những hình ảnh so sánh, ẩn dụ đặc sắc, bài thơ đã thể hiện tình yêu quê hương đất nước nồng nàn, niềm tự hào sâu sắc về ngôn ngữ dân tộc, đồng thời nhắn nhủ mỗi người ý thức trân trọng, giữ gìn sự trong sáng của tiếng Việt.", "hasRead": true }, { "title": "Mưa xuân", "summary": "Bài thơ \"Mưa xuân\" của nhà thơ Nguyễn Bính là câu chuyện tình đầu trong trẻo, e ấp của một cô gái làng quê trên nền không gian mùa xuân Bắc Bộ đậm chất thơ. Mở đầu tác phẩm, nhân vật \"em\" hiện lên với vẻ đẹp mộc mạc, nền nếp của người con gái làm nghề dệt lụa quanh năm bên mẹ già. Khi trời rắc những hạt mưa xuân phơi phới bay, hoa xoan rụng đầy ngõ và gánh chèo làng Đặng kéo qua, lòng cô thiếu nữ bỗng xao xuyến, háo hức xin mẹ đi xem hội ở thôn Đoài với niềm hi vọng thầm kín sẽ được gặp người thương như lời hò hẹn. Thế nhưng, giữa đêm hội đông vui, cô mải miết tìm kiếm trong vô vọng rồi lủi thủi trở về trong nỗi tủi thân, hờn trách dưới làn mưa nặng hạt. Khép lại bài thơ là cảnh mưa xuân đã ngại bay, hoa xoan nát dưới chân giày khi mùa xuân cạn ngày, để lại nỗi buồn man mác cùng niềm mong mỏi, khắc khoải chờ đợi ngày hội ngộ. Bằng thể thơ bảy chữ giàu tính tự sự kết hợp nghệ thuật tả cảnh ngụ tình tinh tế và ngôn ngữ mộc mạc như ca dao, tác phẩm đã khắc họa chân thực diễn biến tâm trạng của người con gái đang yêu, đồng thời tôn vinh vẻ đẹp tâm hồn thuần hậu cùng nét văn hóa truyền thống của làng quê Việt Nam.", "hasRead": true }, { "title": "Bài ca chúc Tết thanh niên", "summary": "Bài thơ \"Bài ca chúc Tết thanh niên\" (viết năm 1927) của nhà chí sĩ yêu nước Phan Bội Châu là lời nhắn nhủ tâm huyết, gửi gắm niềm tin yêu và kì vọng lớn lao vào thế hệ trẻ Việt Nam trước vận mệnh của dân tộc. Mở đầu tác phẩm, tác giả tự nhìn lại chặng đường đầy gian truân của bản thân khi tuổi đã cao mà sự nghiệp cứu nước vẫn dang dở, để từ đó bộc bạch nỗi lòng trông đợi vào lớp người kế cận nhân dịp đầu xuân. Tiếp nối mạch cảm xúc, bài thơ cất lên tiếng gọi thức tỉnh đầy mạnh mẽ, khuyên nhủ thanh niên phải rũ bỏ lối sống tầm thường, hưởng lạc, không cam chịu cảnh nô lệ mà cần nuôi dưỡng chí lớn, tinh thần tự cường, đoàn kết đồng lòng và dấn thân hành động vì nghĩa lớn. Khép lại tác phẩm là lời chúc Tết tha thiết, mong tuổi trẻ xứng đáng làm chủ tương lai, cùng nhau tạo dựng một mùa xuân mới tươi sáng cho đất nước. Với thể thơ hát nói (ca trù) phóng khoáng, linh hoạt cùng giọng điệu vừa chân thành, tâm tình vừa hào sảng, giục giã, bài thơ không chỉ thể hiện tấm lòng yêu nước nồng nàn của Phan Bội Châu mà còn thắp lên ngọn lửa nhiệt huyết, khơi dậy lý tưởng sống cao đẹp và trách nhiệm với Tổ quốc của tuổi trẻ mọi thời đại.", "hasRead": true }, { "title": "Yên Tử, núi thiêng", "summary": "Văn bản thông tin \"Yên Tử, núi thiêng\" của tác giả Thi Sảnh đã khắc họa toàn diện vẻ đẹp hùng vĩ, linh thiêng cùng những giá trị lịch sử, văn hóa đặc sắc của quần thể danh thắng Yên Tử (Quảng Ninh). Nằm trên dãy núi Đông Triều cao hơn một nghìn mét, quanh năm mây mù bao phủ, Yên Tử hiện lên với cảnh sắc thiên nhiên nguyên sơ, kì vĩ cùng hệ thực vật phong phú, nổi bật là những rừng tùng, trúc, mai cổ thụ tạo nên không gian thanh tịnh, thoát tục. Không chỉ có cảnh quan tráng lệ, vùng đất này còn là \"kinh đô tư tưởng\" của Phật giáo Đại Việt khi gắn liền với sự kiện Phật hoàng Trần Nhân Tông từ bỏ ngai vàng lên núi tu hành và sáng lập Thiền phái Trúc Lâm mang đậm bản sắc dân tộc, để lại hệ thống chùa, am, tháp cổ kính như chùa Hoa Yên, chùa Đồng, vườn tháp Huệ Quang ẩn hiện hài hòa giữa núi rừng. Bằng cách trình bày thông tin khách quan, mạch lạc kết hợp khéo léo với yếu tố miêu tả giàu hình ảnh và cảm xúc, văn bản đã làm nổi bật sức sống trường tồn của di sản Yên Tử, qua đó khơi dậy niềm tự hào dân tộc và ý thức trân trọng, giữ gìn những giá trị văn hóa, lịch sử quý báu của đất nước.", "hasRead": true }, { "title": "Tình sông núi", "summary": "Bài thơ \"Tình sông núi\" của nhà thơ Trần Mai Ninh là khúc ca hào sảng, tràn đầy nhiệt huyết ngợi ca vẻ đẹp của quê hương, đất nước trong những năm đầu kháng chiến chống Pháp. Xuyên suốt tác phẩm là bức tranh thiên nhiên vùng đất Nam Trung Bộ hiện lên vô cùng hùng vĩ, tươi đẹp và tràn trề sức sống với những dòng sông, dãy núi, đồng lúa xanh tươi cùng biển trời bao la. Hòa quyện trong khung cảnh thiên nhiên tráng lệ ấy là hình ảnh những con người lao động bình dị, khỏe khoắn, chất phác và những người chiến sĩ kiên cường đang ngày đêm gắn bó máu thịt, cống hiến và chiến đấu bảo vệ từng tấc đất quê hương. Bằng thể thơ tự do phóng khoáng, nhịp điệu sôi nổi, dồn dập cùng hệ thống ngôn từ giàu hình ảnh và cảm xúc mãnh liệt, bài thơ đã thể hiện tình yêu sông núi sâu nặng, thiết tha, đồng thời khơi dậy niềm tự hào dân tộc và ý chí quyết tâm giữ gìn non sông đất nước.", "hasRead": true }, { "title": "Lão Hạc", "summary": "Truyện ngắn \"Lão Hạc\" của nhà văn Nam Cao kể về cuộc đời nghèo khổ, cô độc nhưng giàu lòng tự trọng và tình yêu thương con sâu sắc của một người nông dân trước Cách mạng tháng Tám. Vì gia cảnh khốn khó, không đủ tiền cưới vợ nên con trai lão phẫn chí bỏ đi làm đồn điền cao su, để lại cho lão người bạn bầu bạn duy nhất là con chó vàng. Sau một trận ốm nặng kéo dài cùng thiên tai mất mùa khiến cuộc sống rơi vào bước đường cùng, Lão Hạc đành dứt ruột bán đi \"cậu Vàng\" trong nỗi ân hận, dằn vặt tột cùng. Để giữ trọn mảnh vườn và chút tiền dành dụm cho con trai ngày trở về, không muốn làm phiền lụy đến ai, lão gửi gắm tất cả tài sản cho người hàng xóm tốt bụng là ông Giáo rồi âm thầm xin bả chó của Binh Tư để tự kết liễu đời mình bằng một cái chết đầy đau đớn, dữ dội. Qua điểm nhìn đầy thấu cảm của nhân vật tôi (ông Giáo), tác phẩm không chỉ phản ánh chân thực số phận bi thảm của người nông dân bị đẩy vào bước đường cùng mà còn trân trọng ngợi ca vẻ đẹp nhân cách cao quý, sự lương thiện và đức hi sinh thầm lặng của người lao động nghèo.", "hasRead": true }] } };
  window.LV_DATA = DATA; // dùng chung cho khung tư liệu bối cảnh
  const $ = (selector) => document.querySelector(selector);
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const grades = ['6', '7', '8', '9'];
  let selectedGrade = '';
  let activeLesson = null;
  const picker = $('#lvGradePicker');
  const results = $('#lvLessonResults');
  const modal = $('#lvModalBackdrop');
  const modalBody = $('#lvModalBody');

  function gradeCounts(items) {
    return {
      total: items.length,
      read: items.filter(item => Boolean(item.summary)).length
    };
  }
  function renderGrades() {
    picker.innerHTML = grades.map(grade => {
      const count = gradeCounts(DATA.grades[grade] || []);
      return `<button class="lv-grade-card ${selectedGrade === grade ? 'active' : ''}" type="button" data-lv-grade="${grade}" aria-pressed="${selectedGrade === grade}"><strong>${grade}</strong><span>Khối lớp ${grade}</span><small>${count.total} bài học · ${count.read} bài có nội dung đọc</small></button>`;
    }).join('');
    picker.querySelectorAll('[data-lv-grade]').forEach(button => button.addEventListener('click', () => {
      selectedGrade = button.dataset.lvGrade;
      renderGrades();
      renderLessons();
    }));
  }
  function lessonCard(item, index, grade) {
    const hasRead = Boolean(item.summary);
    const summary = item.summary || 'Bài học đã có trong danh mục; nội dung đọc đang được bổ sung.';
    return `<button class="lv-lesson-card" type="button" data-lv-open="${esc(item.title)}" data-lv-grade="${grade}">
      <div class="lv-lesson-top"><span class="lv-lesson-number">Bài ${String(index + 1).padStart(2, '0')}</span><span class="lv-pills"><span class="lv-pill ${hasRead ? 'ready' : ''}">${hasRead ? 'Có nội dung đọc' : 'Đang bổ sung nội dung'}</span></span></div>
      <h4>${esc(item.title)}</h4><p>${esc(summary)}</p><div class="lv-lesson-bottom"><span>Mở 2 phần đọc</span><span>↗</span></div>
    </button>`;
  }
  function renderLessons() {
    const query = ($('#lvSearchInput').value || '').trim().toLocaleLowerCase('vi');
    const gradeList = selectedGrade ? [selectedGrade] : (query ? grades : []);
    if (!gradeList.length) {
      results.innerHTML = '<div class="lv-first-hint"><span class="lv-hint-mark">✦</span><strong>Hãy chọn khối lớp để bắt đầu.</strong><p>Danh sách bài học sẽ xuất hiện theo từng khối lớp.</p></div>';
    } else {
      const blocks = [];
      gradeList.forEach(grade => {
        const items = (DATA.grades[grade] || []).filter(item => !query || `${item.title} ${item.summary || ''}`.toLocaleLowerCase('vi').includes(query));
        if (!items.length) return;
        blocks.push(`<div class="lv-grade-heading" data-lv-grade="${grade}"><h3>Khối lớp ${grade}</h3><p>${items.length} bài học</p></div><div class="lv-lesson-grid">${items.map((item, index) => lessonCard(item, index, grade)).join('')}</div>`);
      });
      results.innerHTML = blocks.length ? blocks.join('') : '<div class="lv-empty">Không tìm thấy bài học phù hợp. Hãy thử từ khóa khác hoặc chọn khối lớp khác.</div>';
      results.querySelectorAll('[data-lv-open]').forEach(button => button.addEventListener('click', () => openLesson(button.dataset.lvGrade, button.dataset.lvOpen)));
    }
  }
  function renderReadParts() {
    if (!activeLesson) return;
    let cards = '';
    for (let i = 1; i <= 2; i++) {
      let content = '';
      let state = 'Chờ bổ sung';
      if (i === 1 && activeLesson.summary) {
        state = 'Có tài liệu';
        content = `<div class="lv-summary-text">${esc(activeLesson.summary)}</div>`;
      } else if (i === 2 && activeLesson.part2) {
        state = 'Có tài liệu';
        content = `<div class="lv-summary-text">${esc(activeLesson.part2)}</div>`;
      } else {
        content = '<p class="lv-part-note">Phần nội dung này được giữ chỗ để bổ sung tài liệu chính thức.</p>';
      }
      cards += `<article class="lv-part-card"><div class="lv-part-head"><span class="lv-part-index">${String(i).padStart(2, '0')}</span><h4>Phần đọc ${i}</h4><span class="lv-part-state ${state === 'Có tài liệu' ? '' : 'pending'}">${state}</span></div>${content}</article>`;
    }
    modalBody.innerHTML = `<div class="lv-part-grid">${cards}</div><p class="lv-modal-note">Bài học được thiết kế gồm 2 phần đọc. Phần nào chưa có tài liệu sẽ được bổ sung sau.</p>`;
  }
  function openLesson(grade, title) {
    activeLesson = (DATA.grades[grade] || []).find(item => item.title === title);
    if (!activeLesson) return;
    modal.dataset.grade = grade;
    $('#lvModalGrade').textContent = `KHỐI LỚP ${grade}`;
    $('#lvModalTitle').textContent = title;
    $('#lvModalSubtitle').textContent = activeLesson.summary ? 'Đã có nội dung tóm tắt' : 'Nội dung đọc đang được bổ sung';
    renderReadParts();
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    $('#lvModalClose').focus();
  }
  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    activeLesson = null;
  }
  $('#lvSearchInput').addEventListener('input', renderLessons);
  $('#lvShowAll').addEventListener('click', () => { selectedGrade = ''; renderGrades(); renderLessons(); });
  $('#lvModalClose').addEventListener('click', closeModal);
  modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && modal.classList.contains('open')) closeModal(); });
  window.LV_REFRESH = () => { renderGrades(); renderLessons(); };
  renderGrades(); renderLessons();
})();

/* ===== AUDIO GUIDE: 5 nhóm nội dung (Lớp 6, 7, 8, 9, Phê bình văn học) =====
   Cách gắn file mp3: điền đường dẫn vào src của bài tương ứng, ví dụ
     { "title": "Thánh Gióng", "src": "audio/lop6/thanhgionglop6.mp3" }
   Bài chưa có src sẽ hiện nhãn "Sắp có". Có thể thêm/bớt/đổi tên bài trong mảng tracks. */
(function () {
  const AUDIO_LIBRARY = {
    "6": {
      "label": "Lớp 6",
      "tracks": [
        {
          "title": "Thánh Gióng",
          "src": "audio/lop6/thanhgionglop6.mp3"
        },
        {
          "title": "Sơn Tinh, Thủy Tinh",
          "src": "audio/lop6/sontinhthuytinhlop6.mp3"
        },
        {
          "title": "Thạch Sanh",
          "src": "audio/lop6/thachsanhlop6.mp3"
        },
        {
          "title": "Gió lạnh đầu mùa",
          "src": "audio/lop6/giolanhdaumualop6.mp3"
        },
        {
          "title": "Cô Tô",
          "src": "audio/lop6/cotolop6.mp3"
        },
        {
          "title": "Cây khế",
          "src": "audio/lop6/caykhelop6.mp3"
        },
        {
          "title": "Cây tre Việt Nam",
          "src": "audio/lop6/caytrevietnamlop6.mp3"
        },
        {
          "title": "Cửu Long giang ta ơi",
          "src": "audio/lop6/cuulonggiangtaoilop6.mp3"
        }
      ]
    },
    "7": {
      "label": "Lớp 7",
      "tracks": [
        {
          "title": "Đi lấy mật",
          "src": "audio/lop7/dilaymatlop7.mp3"
        },
        {
          "title": "Đồng dao mùa xuân",
          "src": "audio/lop7/dongdaomuaxuanlop7.mp3"
        },
        {
          "title": "Bồng chanh đỏ",
          "src": "audio/lop7/bongchanhdolop7.mp3"
        },
        {
          "title": "Gặp lá cơm nếp",
          "src": "audio/lop7/gaplacomneplop7.mp3"
        },
        {
          "title": "Vừa nhắm mắt vừa mở cửa sổ",
          "src": "audio/lop7/vuanhammatvuamocuasolop7.mp3"
        },
        {
          "title": "Quê hương",
          "src": "audio/lop7/quehuonglop7.mp3"
        },
        {
          "title": "Gò Me",
          "src": "audio/lop7/gomelop7.mp3"
        },
        {
          "title": "Mùa xuân nho nhỏ",
          "src": "audio/lop7/muaxuannhonholop7.mp3"
        }
      ]
    },
    "8": {
      "label": "Lớp 8",
      "tracks": [
        {
          "title": "Lá cờ thêu sáu chữ vàng",
          "src": "audio/lop8/lacotheusauchuvanglop8.mp3"
        },
        {
          "title": "Quang Trung đại phá quân Thanh",
          "src": "audio/lop8/quangtrungdaiphaquanthanhlop8.mp3"
        },
        {
          "title": "Thu điếu",
          "src": "audio/lop8/thudieulop8.mp3"
        },
        {
          "title": "Thiên Trường vãn vọng",
          "src": "audio/lop8/thientruongvanvonglop8.mp3"
        },
        {
          "title": "Hịch tướng sĩ",
          "src": "audio/lop8/hichtuongsilop8.mp3"
        },
        {
          "title": "Tinh thần yêu nước của nhân dân ta",
          "src": "audio/lop8/tinhthanyeunuoccuanhandantalop8.mp3"
        },
        {
          "title": "Nam quốc sơn hà",
          "src": "audio/lop8/namquocsonhalop8.mp3"
        },
        {
          "title": "Lai Tân",
          "src": "audio/lop8/laitanlop8.mp3"
        },
        {
          "title": "Lặng lẽ Sa Pa",
          "src": "audio/lop8/langlesapalop8.mp3"
        },
        {
          "title": "Bếp lửa",
          "src": "audio/lop8/beplualop8.mp3"
        },
        {
          "title": "Lá đỏ",
          "src": "audio/lop8/ladolop8.mp3"
        },
        {
          "title": "Những ngôi sao xa xôi",
          "src": "audio/lop8/nhungngoisaoxasoilop8.mp3"
        }
      ]
    },
    "9": {
      "label": "Lớp 9",
      "tracks": [
        {
          "title": "Chuyện người con gái Nam Xương",
          "src": "audio/lop9/chuyennguoicongainamxuonglop9.mp3"
        },
        {
          "title": "Sơn Tinh, Thủy Tinh",
          "src": "audio/lop9/sontinhthuytinhlop9.mp3"
        },
        {
          "title": "Nỗi niềm chinh phụ",
          "src": "audio/lop9/noiniemchinhphulop9.mp3"
        },
        {
          "title": "Tiếng đàn mưa",
          "src": "audio/lop9/tiengdanmualop9.mp3"
        },
        {
          "title": "Kim Kiều gặp gỡ",
          "src": "audio/lop9/kimkieugapgolop9.mp3"
        },
        {
          "title": "Lục Vân Tiên đánh cướp, cứu Kiều Nguyệt Nga",
          "src": "audio/lop9/lucvantiendanhcuopkieunguyetngalop9.mp3"
        },
        {
          "title": "Tự tình",
          "src": "audio/lop9/tutinhlop9.mp3"
        },
        {
          "title": "Tiếng Việt",
          "src": "audio/lop9/tiengvietlop9.mp3"
        },
        {
          "title": "Mưa xuân",
          "src": "audio/lop9/muaxuanlop9.mp3"
        },
        {
          "title": "Bài ca chúc Tết thanh niên",
          "src": "audio/lop9/baicachuctetthanhnienlop9.mp3"
        },
        {
          "title": "Yên Tử, núi thiêng",
          "src": "audio/lop9/yentunuithienlop9.mp3"
        },
        {
          "title": "Tình sông núi",
          "src": "audio/lop9/tinhsongnuilop9.mp3"
        },
        {
          "title": "Lão Hạc",
          "src": "audio/lop9/laohaclop9.mp3"
        }
      ]
    },
    "pb": {
      "label": "Phê bình văn học",
      "tracks": [
        {
          "title": "Bánh trôi nước",
          "src": "audio/phebinh/phebinhvanhocbanhtroinuoc.mp3"
        },
        {
          "title": "Lặng lẽ Sa Pa",
          "src": "audio/phebinh/phebinhvanhoclanglesapa.mp3"
        },
        {
          "title": "Lão Hạc",
          "src": "audio/phebinh/phebinhvanhoclaohac.mp3"
        },
        {
          "title": "Lục Vân Tiên",
          "src": "audio/phebinh/phebinhvanhoclucvantien.mp3"
        },
        {
          "title": "Mùa xuân nho nhỏ",
          "src": "audio/phebinh/phebinhvanhocmuaxuannhonho.mp3"
        },
        {
          "title": "Nỗi niềm chinh phụ",
          "src": "audio/phebinh/phebinhvanhocnoiniemchinhphu.mp3"
        }
      ]
    }
  };
  const ORDER = ['6', '7', '8', '9', 'pb'];
  const MARKS = { '6': '6', '7': '7', '8': '8', '9': '9', 'pb': '\u201C' };
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const catsEl = document.getElementById('auCats'), stage = document.getElementById('auStage'), player = document.getElementById('auPlayer'),
    audio = document.getElementById('auAudio'), nowTitle = document.getElementById('auNowTitle'), nowGroup = document.getElementById('auNowGroup');
  if (!catsEl || !stage || !audio) return;
  let current = '', playingIndex = -1, triedDataUri = false;
  const helpEl = document.getElementById('auHelp'), helpBtn = document.getElementById('auHelpBtn');
  const showHelp = on => { if (helpEl) helpEl.hidden = !on; };
  if (helpBtn) helpBtn.addEventListener('click', () => showHelp(helpEl.hidden));
  (function () {   // tự mở hướng dẫn nếu đang ở trình duyệt nhúng trong app (Zalo, Facebook, Messenger...) hoặc xem trước tệp
    const ua = navigator.userAgent || '';
    const inApp = /Zalo|FBAN|FBAV|FB_IAB|Messenger|Instagram|Line\/|TikTok|MicroMessenger|Snapchat/i.test(ua)
      || (/Android/.test(ua) && /; wv\)/.test(ua))
      || (/iPhone|iPad|iPod/.test(ua) && !/Safari\//.test(ua));
    if (inApp) showHelp(true);
  })();

  const say = msg => { if (typeof showToast === 'function') showToast(msg); };

  function renderCats() {
    catsEl.innerHTML = ORDER.map(key => {
      const c = AUDIO_LIBRARY[key], total = c.tracks.length, ready = c.tracks.filter(t => t.src).length;
      const info = total ? `${total} bài · ${ready} đã có âm thanh` : 'Đang cập nhật bài nghe';
      return `<button class="au-cat ${current === key ? 'active' : ''}" type="button" data-au-cat="${key}" aria-pressed="${current === key}"><strong>${MARKS[key]}</strong><span>${esc(c.label)}</span><small>${info}</small></button>`;
    }).join('');
    catsEl.querySelectorAll('[data-au-cat]').forEach(b => b.addEventListener('click', () => selectCat(b.dataset.auCat)));
  }
  function renderStage() {
    if (!current) {
      stage.innerHTML = '<div class="lv-first-hint"><span class="lv-hint-mark">\u2726</span><strong>Hãy chọn một nội dung để bắt đầu.</strong><p>Danh sách bài nghe sẽ xuất hiện tại đây.</p></div>';
      return;
    }
    const c = AUDIO_LIBRARY[current], tracks = c.tracks;
    if (!tracks.length) {
      stage.innerHTML = `<div class="lv-grade-heading" data-au-cat="${current}"><h3>${esc(c.label)}</h3><p>Đang cập nhật</p></div><div class="lv-empty">Danh sách bài nghe của mục này đang được cập nhật.</div>`;
      return;
    }
    stage.innerHTML = `<div class="lv-grade-heading" data-au-cat="${current}"><h3>${esc(c.label)}</h3><p>${tracks.length} bài nghe</p></div><div class="au-list" data-au-cat="${current}">` +
      tracks.map((t, i) => `<button class="au-track" type="button" data-au-track="${i}" ${t.src ? '' : 'disabled'}><span class="au-num">${String(i + 1).padStart(2, '0')}</span><span class="au-name">${esc(t.title)}</span><span class="au-tag">${t.src ? '\u25B6 Nghe' : 'Sắp có'}</span></button>`).join('') + '</div>';
    stage.querySelectorAll('[data-au-track]').forEach(b => b.addEventListener('click', () => play(Number(b.dataset.auTrack))));
    markPlaying();
  }
  function markPlaying() {
    stage.querySelectorAll('[data-au-track]').forEach(b => {
      const on = Number(b.dataset.auTrack) === playingIndex && !player.hidden;
      b.classList.toggle('playing', on);
      const tag = b.querySelector('.au-tag');
      if (tag && !b.disabled) tag.textContent = on ? 'Đang phát' : '\u25B6 Nghe';
    });
  }
  function stopAudio() {
    audio.pause(); audio.removeAttribute('src'); audio.load();
    player.hidden = true; playingIndex = -1;
  }
  function selectCat(key) {
    if (key === current) return;
    stopAudio(); current = key; renderCats(); renderStage();
  }

  /* ---- Audio nhúng sẵn trong file (base64 trong thẻ <script data-audio-src>) ----
     Chỉ đọc nội dung base64 của ĐÚNG bài đang bấm, giải mã -> Blob URL.
     Giữ tối đa 3 Blob gần nhất để không ngốn RAM điện thoại. */
  const HOLDERS = {};
  document.querySelectorAll('script[data-audio-src]').forEach(el => { HOLDERS[el.getAttribute('data-audio-src')] = el; });
  const getB64 = path => { const h = HOLDERS[path]; return h ? h.textContent.trim() : ''; };
  const BLOB_CACHE = new Map(), MAX_CACHE = 3;

  function blobUrlFor(path) {
    if (BLOB_CACHE.has(path)) {            // đã giải mã rồi: dùng lại và đánh dấu "mới dùng"
      const u = BLOB_CACHE.get(path); BLOB_CACHE.delete(path); BLOB_CACHE.set(path, u); return u;
    }
    const b64 = getB64(path);
    if (!b64) return '';
    const bin = atob(b64), bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const url = URL.createObjectURL(new Blob([bytes], { type: 'audio/mpeg' }));
    BLOB_CACHE.set(path, url);
    while (BLOB_CACHE.size > MAX_CACHE) {
      const oldest = BLOB_CACHE.keys().next().value;
      URL.revokeObjectURL(BLOB_CACHE.get(oldest)); BLOB_CACHE.delete(oldest);
    }
    return url;
  }
  function dataUrlFor(path) { const b64 = getB64(path); return b64 ? 'data:audio/mpeg;base64,' + b64 : ''; }
  function srcFor(path) {
    try { const u = blobUrlFor(path); if (u) return u; } catch (e) { }
    return dataUrlFor(path) || path;      // cuối cùng mới dùng đường dẫn file ngoài (nếu có)
  }

  function startPlayback() {
    const p = audio.play();
    if (p && p.catch) p.catch(err => {
      if (err && err.name === 'AbortError') return;   // vừa đổi bài/đang nạp lại: bình thường
      if (err && err.name === 'NotAllowedError') {
        say('Điện thoại đang chặn tự phát — hãy bấm nút ▶ trên thanh phát.');
      }
      /* lỗi khác (không hỗ trợ/không tải được) sẽ do sự kiện "error" bên dưới xử lý */
    });
  }
  function play(index) {
    const c = AUDIO_LIBRARY[current], track = c && c.tracks[index];
    if (!track || !track.src) return;
    const firstShow = player.hidden;
    playingIndex = index; triedDataUri = false;
    nowGroup.textContent = c.label;
    nowTitle.textContent = track.title;
    player.hidden = false;
    markPlaying();
    audio.preload = 'auto';
    audio.src = srcFor(track.src);
    startPlayback();                       // gọi ngay trong lúc bấm để iOS/Android cho phép phát
    if (firstShow && player.scrollIntoView) player.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  audio.addEventListener('ended', () => {
    if (!AUDIO_LIBRARY[current] || playingIndex < 0) return;
    const tracks = AUDIO_LIBRARY[current].tracks;
    for (let i = playingIndex + 1; i < tracks.length; i++) { if (tracks[i].src) { play(i); return; } }
    playingIndex = -1; markPlaying();
  });
  audio.addEventListener('error', () => {
    const src = audio.getAttribute('src');
    if (!src) return;                      // do stopAudio() chủ động gỡ src, không phải lỗi thật
    const c = AUDIO_LIBRARY[current], track = c && c.tracks[playingIndex];
    /* Một số trình duyệt trong ứng dụng (Zalo, Facebook, Messenger...) chặn blob: -> thử lại bằng data: */
    if (!triedDataUri && src.indexOf('blob:') === 0 && track && HOLDERS[track.src]) {
      triedDataUri = true;
      audio.src = dataUrlFor(track.src);
      startPlayback();
      return;
    }
    const code = audio.error ? audio.error.code : 0;
    say('Không phát được bài này' + (code ? ' (mã lỗi ' + code + ')' : '') + '. Hãy thử mở trang bằng Chrome hoặc Safari.');
    showHelp(true);
  });
  renderCats(); renderStage();
})();


/* ===== KHUNG TƯ LIỆU BỐI CẢNH (mục 02) =====
   Bấm "↗" ở 3 thẻ -> mở khung ngay dưới: 4 ô khối lớp -> danh sách bài học của khối đó.
   Danh sách bài lấy chung từ dữ liệu mục 3 (window.LV_DATA).
   Nội dung từng bài sẽ được bổ sung sau (hiện chỉ hiển thị danh sách, chưa mở cửa sổ đọc).
   Bấm lại đúng link đó hoặc nút × để đóng khung. */
(function () {
  const LV = window.LV_DATA;
  const panel = document.getElementById('ctxPanel');
  if (!LV || !panel) return;
  const $ = id => document.getElementById(id);
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const GRADES = ['6', '7', '8', '9'];
  const TOPICS = {
    space: { label: 'Không gian & địa danh', eyebrow: 'Tư liệu 01',
      desc: 'Lần theo những vùng đất, con đường, dòng sông và không gian đã đi vào tác phẩm. Chọn khối lớp để xem danh sách bài học.' },
    history: { label: 'Lịch sử & thời đại', eyebrow: 'Tư liệu 02',
      desc: 'Đặt câu chuyện vào bối cảnh lịch sử để hiểu thêm lựa chọn và số phận nhân vật. Chọn khối lớp để xem danh sách bài học.' },
    culture: { label: 'Văn hóa & đời sống', eyebrow: 'Tư liệu 03',
      desc: 'Khám phá phong tục, nếp sống, biểu tượng và chất liệu văn hóa trong văn chương. Chọn khối lớp để xem danh sách bài học.' }
  };
  const picker = $('ctxGradePicker'), results = $('ctxResults');
  const links = document.querySelectorAll('[data-ctx]');
  let topic = '', grade = '';

  function renderGrades() {
    picker.innerHTML = GRADES.map(g => {
      const n = (LV.grades[g] || []).length;
      return `<button class="lv-grade-card ${grade === g ? 'active' : ''}" type="button" data-g="${g}" aria-pressed="${grade === g}"><strong>${g}</strong><span>Khối lớp ${g}</span><small>${n} bài học</small></button>`;
    }).join('');
    picker.querySelectorAll('[data-g]').forEach(b => b.addEventListener('click', () => { grade = b.dataset.g; renderGrades(); renderLessons(); }));
  }
  function renderLessons() {
    if (!grade) {
      results.innerHTML = '<div class="lv-first-hint"><span class="lv-hint-mark">\u2726</span><strong>Hãy chọn khối lớp để bắt đầu.</strong><p>Danh sách bài học sẽ xuất hiện theo từng khối lớp.</p></div>';
      return;
    }
    const label = TOPICS[topic].label.toLocaleLowerCase('vi'), items = LV.grades[grade] || [];
    results.innerHTML = `<div class="lv-grade-heading" data-lv-grade="${grade}"><h3>Khối lớp ${grade}</h3><p>${items.length} bài học</p></div><div class="lv-lesson-grid">` +
      items.map((it, i) => `<div class="lv-lesson-card ctx-lesson" data-g="${grade}"><div class="lv-lesson-top"><span class="lv-lesson-number">Bài ${String(i + 1).padStart(2, '0')}</span><span class="lv-pills"><span class="lv-pill">Đang bổ sung</span></span></div><h4>${esc(it.title)}</h4><p>Tư liệu về ${esc(label)} của bài này sẽ được bổ sung.</p></div>`).join('') + '</div>';
  }
  function updateLinks() {
    links.forEach(a => {
      const on = !panel.hidden && a.dataset.ctx === topic;
      a.setAttribute('aria-expanded', on ? 'true' : 'false');
      const card = a.closest('.context-card'); if (card) card.classList.toggle('active', on);
    });
  }
  function openPanel(key) {
    topic = key; const T = TOPICS[key];
    $('ctxEyebrow').textContent = T.eyebrow;
    $('ctxTitle').textContent = T.label;
    $('ctxDesc').textContent = T.desc;
    panel.hidden = false;
    renderGrades(); renderLessons(); updateLinks();
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function closePanel() { panel.hidden = true; topic = ''; updateLinks(); }

  links.forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    const key = a.dataset.ctx;
    if (!panel.hidden && topic === key) closePanel(); else openPanel(key);
  }));
  $('ctxClose').addEventListener('click', () => {
    const a = document.querySelector(`[data-ctx="${topic}"]`);
    closePanel(); if (a) { a.focus(); a.closest('.context-card').scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  });
})();
