class Score < ApplicationRecord
  include FriendlyId
  friendly_id :token
  is_impressionable counter_cache: true, column_name: :views_count

  belongs_to :user, optional: true
  has_many :favs, dependent: :destroy

  enum status: {
    published: 0,
    closed:    1,
    deleted:   2
  }
  enum instrument: {
    Piano:   0,
    Guitar:  1,
    Strings: 2
  }
  enum beat: {
    "2/4": 0,
    "3/4": 1,
    "4/4": 2,
    "5/4": 3,
    "6/4": 4,
    "7/4": 5
  }

  validates :title,   presence: true, length: { maximum: 40 }
  validates :content, presence: true, length: { maximum: 1024 }

  before_create do
    self.token = SecureRandom.urlsafe_base64(8)
  end

  scope :all_published, -> (id) { where(user_id: id, status: :published).order(id: :desc) }
  scope :all_editable,  -> (id) { where(user_id: id).where.not(status: :deleted).order(id: :desc) }
  scope :search,        -> (sort_key, order) { where(status: :published).order(sort_key => order) }

  def owner?(id)
    user_id == id
  end

  def browsable?(id)
    published? || owner?(id)
  end
end
